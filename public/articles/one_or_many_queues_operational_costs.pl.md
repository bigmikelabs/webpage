## Wstęp 

Event-driven architecture jest dziś niezwykle popularna. Pytania o CQRS czy event sourcing pojawiają się niemal na każdej rozmowie rekrutacyjnej w projektach IT.
Wiele zespołów ochoczo wskakuje w ten nurt od samego początku projektu, gdzie nic jeszcze nie wiadomo o samym "biznesie", czy domenie. 

Masz coś związanego z płatnościami? Event sourcing wydaje się niezbędny.
Musisz zapewnić, że requesty będą przetwarzane niezależnie od awarii? CQRS to naturalny wybór.
Wpakujmy w to jeszcze DDD (domain-driven-design) i mamy nowoczesny serwis, a jeszcze lepiej mikroserwis!

Problem w tym, że eventy i wszystko, co z nimi związane, to nie tylko decyzja architektoniczna, czy wybór wzorca projektowego.
To decyzja, która wpływa na codzienną pracę z kodem, jego debugowaniem, wsparciem produkcji, potrzebnymi narzędziami i ogólnie - cały projekt!
I co może nawet ważniejsze – to decyzja, która bezpośrednio determinuje, jak skalujesz system i jak go monitorujesz.

Papier wszystko przyjmie i na papierze wszystko wygląda super, ale nie wszystko tak samo szybko i sprawnie działa. 
A haczykiem eventów i kolejek jest to, ze szybko związują one ręcę podczas wsparcia produkcji, zwlaszcza, gdy cos nie dziala i dzwonia do nas klienci. 

## Podstawy - kolejki to nie tylko warstwa transportowa 

W sieci jest mnóstwo dokumentacji na temat [event-driven architektury](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven) czy
[event sourcingu](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing).
Zanim jednak przejdziemy do szczegółów, warto ustalić kilka faktów, abyśmy mieli wspólny obraz sytuacji. Oczywiste oczywistości, ale…

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
