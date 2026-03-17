## Wstęp 

Event-driven architecture jest dziś niezwykle popularna. Pytania o CQRS czy event sourcing pojawiają się niemal na każdej rozmowie rekrutacyjnej, 
a wiele zespołów wskakuje w ten nurt już na samym początku projektu — często zanim dobrze zrozumieją domenę biznesową.

Masz coś związanego z płatnościami? Event sourcing brzmi jak oczywisty wybór.
Chcesz odporności na awarie? CQRS.
Dodajmy do tego DDD i mamy „nowoczesną architekturę”.

Brzmi dobrze. Na papierze wszystko się zgadza.
Problem zaczyna się później — na produkcji.

Ostatnio trafiłem na dość ciekawy przypadek, który regularnie odpalał alarmy w godzinach szczytu.
Dotyczył jednej z kolejek w systemie event-driven.

Alert był prosty: **rośnie liczba wiadomości w kolejce (lag) i system nie nadąża z ich przetwarzaniem**.
Z pozoru — klasyczny problem.

Tyle że:

•	autoskalowanie oparte o lag dochodziło do limitu… i nic to nie zmieniało

•	zwiększenie limitów również nie pomagało

•	metryki infrastruktury wyglądały zdrowo:

	•	baza danych: ~10 ms (p99)

	•	cache: ~5 ms (p99)
	
	•	przetwarzanie pojedynczej wiadomości: ~50 ms (p99)

Czyli wszystko działało „zgodnie z planem”.
A mimo to system nie był w stanie nadrobić zaległości.

Naturalne pytanie: skoro każdy element działa poprawnie, to dlaczego całość nie skaluje się i nie zachowuje tak, jak powinna?
Odpowiedź nie leżała ani w infrastrukturze, ani w parametrach systemu.

Trzeba było trochę głębiej pokopać.



## Opis problemu



W moim przypadku 


Nic więc dziwnego, ze niedawno na produkcji 

I wszystko wygląda pięknie w teorii na papierze, az nagle na produkcji widzisz, jak lag w jednej z kolejek rosnie i utrzymuje się przez dluzszą chwile.
Ruch spada, a lag dalej nie maleje. System wydaje się działać okay, dostępy do baz i cache'u sa szybkie (5-10ms), przetwarzanie pojedynczej wiadomosci w kolejce zajmuje 100ms, a lag dalej nie maleje.
I 

Osobiście nie mam przeciwko 
Problem w tym, że event-driven to nie tylko zestaw wzorców, który pozwalają rozwiązać pewne problemy (stwarzając inne).

To zestaw decyzji, które bezpośrednio wpływają na:

•	sposób pracy z kodem,

•	debugowanie i wsparcie produkcji,

•	narzędzia, których będziesz potrzebować,

•	oraz – co najważniejsze – sposób skalowania i monitorowania systemu.


## Podstawy - kolejki to nie tylko warstwa transportowa 

W sieci jest mnóstwo dokumentacji na temat [event-driven architektury](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven) czy
[event sourcingu](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing).
W większości materiałów kolejki przedstawiane są jako prosty mechanizm: **producent → kolejka → konsument**.
W praktyce to uproszczenie jest bardzo mylące.

Topologia kolejki nie tylko transportuje dane — ona definiuje:

•	jak system się skaluje,

•	co jesteś w stanie zaobserwować,

•	jak reaguje na przeciążenia,

•	i jak wygląda jego operacyjne utrzymanie.


Zanim jednak przejdziemy do szczegółów, warto ustalić kilka faktów, abyśmy mieli wspólny obraz sytuacji. Oczywiste oczywistości, ale…

### Typowe podejścia do topologii kolejek

| Podejście | Główne zalety | Główne ograniczenia |
|----------|---------------|---------------------|
| **Jedna kolejka (single stream)** | Prosta architektura, łatwy replay, mniej infrastruktury | Brak kontroli nad typami pracy, mieszanie priorytetów, trudniejsze skalowanie i monitoring |
| **Kolejka na domenę** | Izolacja domenowa, lepsza obserwowalność, sensowne skalowanie | Więcej komponentów, większy narzut operacyjny |
| **Kolejka na typ eventu/requestu** | Precyzyjne skalowanie, niezależność konsumentów, czyste kontrakty | Eksplozja liczby kolejek, potrzeba governance, większa złożoność |

### Wpływ topologii kolejki na system

| Podejście | Skalowalność | Monitoring | Priorytety / SLA | Złożoność operacyjna |
|----------|--------------|------------|------------------|----------------------|
| **Jedna kolejka (single stream)** | Skalowanie na podstawie całego ruchu – brak kontroli nad typami pracy | Zagregowane metryki, trudne rozróżnienie problemów | Trudne do egzekwowania – wszystkie eventy konkurują o zasoby | Niska na start, rośnie wraz ze skalą systemu |
| **Kolejka na domenę** | Skalowanie per domena – lepsza kontrola nad obciążeniem | Czytelniejsze metryki na poziomie domen | Możliwe częściowe rozdzielenie priorytetów | Średnia – więcej komponentów do utrzymania |
| **Kolejka na typ eventu/requestu** | Bardzo precyzyjne skalowanie – pełna kontrola nad workloadem | Bardzo dobra obserwowalność per typ eventu | Naturalne wsparcie dla różnych SLA i priorytetów | Wysoka – wymaga governance i zarządzania |

Większość systemów *event-driven* traktuje kolejki jak proste streamy: producent → kolejka → konsument.
W praktyce jednak topologia kolejki ma duży wpływ na działanie całego systemu. Decyzje te przekładają się na skalowanie, monitoring, stabilność i koszty operacyjne. Projekt kolejki to więc nie drobny szczegół implementacyjny, ale ważna decyzja architektoniczna.

Typowe podejścia do kolejek to:

1. **Jedna kolejka dla wszystkich eventów**

Przykładowe eventy:

•	user_created

•	order_paid

•	invoice_sent

Zalety:

•	prosta architektura

•	łatwe odtwarzanie zdarzeń

•	dobrze sprawdza się w pipeline’ach typu [CDC, tj. change-data-capture](https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/about-change-data-capture-sql-server?view=sql-server-ver17)

Wady:

•	mieszane obciążenia w jednej kolejce

•	trudniejszy monitoring

•	trudniejsze autoskalowanie

2. **Kolejka na domenę**

Przykład:

  •	user-events

  •	order-events

  •	payment-events

Zalety:

•	izolacja domenowa

•	łatwiejsze skalowanie

•	czytelniejsza obserwowalność

Wady:

•	więcej infrastruktury

•	większy narzut operacyjny

3. **Kolejka na typ eventu**

Przykład:

•	user_created

•	order_paid

•	invoice_sent

Zalety:

•	czyste kontrakty między producentem a konsumentem

•	niezależność konsumentów

•	precyzyjne skalowanie

Wady:

•	szybka eksplozja tematów (topic explosion)

•	bardziej złożone zarządzanie

## Autoskalowanie

W wielu systemach liczba konsumentów jest skalowana dynamicznie w oparciu o takie wskaźniki, jak:

• długość kolejki

• lag, tj. opóźnienia w przetwarzaniu zdarzeń czy zaległy backlog. 

Na pierwszy rzut oka wydaje się to proste – im więcej zdarzeń w kolejce, tym więcej zasobów należy uruchomić. Problem pojawia się jednak, gdy w jednej kolejce mieszają się różne typy zdarzeń o bardzo różnym charakterze i wymaganiach. 

Wyobraźmy sobie kolejkę, w której 90% ruchu to eventy analityczne, a tylko 10% to powiadomienia e-mail. Autoscaler, obserwując rosnącą długość kolejki, może zwiększyć liczbę workerów obsługujących e-maile, mimo że problem stanowi w rzeczywistości obciążenie generowane przez eventy analityczne. W efekcie zasoby są przydzielane nieefektywnie, a poszczególne typy zdarzeń nie otrzymują optymalnej obsługi.

Dodatkowo kazdy event moze miec rozny piorytet. Eventy o wypadkach powinny byc dostarczana jak najszybciej (np. do 5 sekund), ale powiadomienia e-mail mogą być wysłane nawet w przeciagu paru godzin.

Wniosek jest prosty, ale istotny: mieszane obciążenia w jednej kolejce mogą „złamać” logikę autoskalowania i znacząco wpłynąć na wydajność systemu. 

## Koszty operacyjne

Topologia kolejki ma realny wpływ na wydatki i wysiłek związany z utrzymaniem systemu. Jedna kolejka dla wszystkich zdarzeń może wydawać się prostym i tanim rozwiązaniem – w końcu mniej komponentów to mniej konfiguracji. W praktyce jednak mieszane obciążenia potrafią „zepsuć” ekonomię: intensywny ruch jednego typu zdarzeń wymusza skalowanie konsumentów dla całej kolejki, nawet jeśli inne typy zadań potrzebują ich minimalnie. Efekt? Płacimy za moc obliczeniową, której tak naprawdę nie potrzebujemy.

Oddzielne kolejki dla domen czy typów eventów pozwalają przypisać zasoby precyzyjnie tam, gdzie są potrzebne. Każda kolejka skaluje się niezależnie, konsumenci uruchamiani są tylko tam, gdzie faktycznie wykonują pracę. To nie tylko ogranicza koszty, ale też upraszcza monitorowanie i utrzymanie – widać dokładnie, który typ zdarzeń generuje obciążenie, a który nie.

## Monitoring

Topologia kolejki ma też ogromny wpływ na to, jak widzimy i kontrolujemy system. Gdy wszystkie zdarzenia trafiają do jednej kolejki, łatwo przegapić sygnały, które są istotne dla poszczególnych typów eventów. Mieszane obciążenia sprawiają, że metryki stają się „zagregowane” i mniej czytelne – trudno odróżnić, czy opóźnienia wynikają z przetwarzania zdarzeń analitycznych, czy z problemów z wysyłką powiadomień e-mail.

W przypadku kolejki przypisanej do konkretnej domeny lub typu zdarzenia, monitorowanie staje się znacznie prostsze i bardziej precyzyjne. Możemy łatwo wyłapać opóźnienia, wąskie gardła lub błędy specyficzne dla danego rodzaju eventów, a alerty trafiają do osób, które faktycznie są odpowiedzialne za dany obszar. Dzięki temu obserwowalność systemu rośnie, a operacje stają się bardziej przewidywalne i bezpieczne.

W praktyce oznacza to, że decyzja o strukturze kolejki nie jest tylko kwestią architektoniczną – decyduje też o tym, jak łatwo utrzymamy system i jak szybko zareagujemy na problemy.
