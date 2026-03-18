## Wstęp 

Event-driven architecture jest dziś niezwykle popularna. Pytania o CQRS czy event sourcing pojawiają się niemal na każdej rozmowie rekrutacyjnej, 
a wiele zespołów wskakuje w ten nurt już na samym początku projektu — często zanim dobrze zrozumieją domenę biznesową.

Masz coś związanego z płatnościami? *Event sourcing* brzmi jak oczywisty wybór.

Chcesz odporności na awarie? *CQRS*.

Dodajmy do tego *DDD* (domain-driven-design) i mamy „nowoczesną architekturę”.

Brzmi dobrze. Na papierze wszystko się zgadza.

---

Problem zaczyna się później — na produkcji.

Ostatnio trafiłem na dość ciekawy przypadek, który regularnie odpalał alarmy w godzinach szczytu.

Dotyczył jednej z kolejek w systemie event-driven.

Alert był prosty: **rośnie liczba wiadomości w kolejce (lag) i system nie nadąża z ich przetwarzaniem**.
Z pozoru — klasyczny problem.

Tyle że:

•	autoskalowanie oparte o lag dochodziło do limitu… i nic to nie zmieniało

•	zwiększenie limitów również nie pomagało

•	metryki infrastruktury wyglądały zdrowo:

-	baza danych: ~10 ms (p99)

-	cache: ~5 ms (p99)

-	przetwarzanie pojedynczej wiadomości: ~50 ms (p99)

---

Czyli wszystko działało „zgodnie z planem”.
A mimo to system nie był w stanie nadrobić zaległości.

Naturalne pytanie: skoro każdy element działa poprawnie, to dlaczego całość nie skaluje się i nie zachowuje tak, jak powinna?
Odpowiedź nie leżała ani w infrastrukturze, ani w parametrach systemu.

Trzeba było trochę głębiej pokopać.


## Opis problemu

W praktyce problem na wykresie kolejki i jej lagu wygląda w następujący sposób:

<figure>
<img src="/images/event-loops-inc/feedback-loop.jpg" alt="Event queue with feedback loop" />
<figcaption>Wykres 1: Przykładowy wykres kolejki pokazujący narastający lag spowodowany feedback loop w systemie event-driven.</figcaption>
</figure>

Możemy wyróżnić trzy charakterystyczne fazy:

1.	Spike

To moment, w którym zaczyna się wzmożony ruch i liczba eventów “zalewa” system, który nie jest w stanie przetwarzać ich na bieżąco.
Na tym etapie mechanizm autoskalowania zaczyna się powoli aktywować, ale jeszcze nie nadąża.

2.	Saturation

Faza, w której system wydaje się stabilizować – liczba eventów w kolejce przestaje gwałtownie rosnąć. Na wykresie może to wyglądać niemal jak linia pozioma.
Może to sugerować, że do kolejki “wpada” mniej więcej tyle samo eventów, ile z niej “wychodzi”.
W tej fazie autoskalowanie jest już w pełni aktywne i powinno zacząć skracać lag. Jednak w praktyce równowaga często utrzymuje się dłużej, niż można by oczekiwać. 
W moim przypadku zauważyłem, że trend ten potrafił utrzymywać się nawet po godzinach szczytu.

3.	Back to operational

W końcowej fazie system wreszcie “odblokowuje się” i zaczyna nadrabiać zaległości – eventy są przetwarzane szybciej, a lag stopniowo maleje.

## Analiza przyczyn problemu

Aby zrozumieć, dlaczego autoskalowanie nie działało zgodnie z oczekiwaniami, musiałem przyjrzeć się bliżej logice systemu i kodowi obsługującemu eventy.

Podczas analizy odkryłem, że niektóre eventy w kolejce generowały kolejne eventy, które trafiały z powrotem do tej samej kolejki lub do powiązanych kolejek. W moim przypadku eventy odzwierciedlały maszynę stanów dla pewnego procesu biznesowego. Przykładowe eventy były zdefiniowane w następujący sposób:

•	UserOrderRaisedEvent

•	UserOrderAcceptedEvent

•	UserOrderWaitingForPaymentEvent

•	UserOrderPaymentDoneEvent

•   UserOrderWaitingForCollection

•   ... dobre 10 innych eventów związanych z obsługą procesu biznesowego

Nie dziwi fakt, że wszystkie te eventy trafiały do tej samej kolejki — były związane z tą samą domeną.

Efekt był taki, że im bardziej system się skalował, tym więcej eventów przetwarzał, co uruchamiało kolejne transakcje biznesowe i generowało jeszcze więcej eventów. 
Kolejka FIFO dodatkowo mogła wydłużać czas przetwarzania pojedynczej transakcji biznesowej, ponieważ najpierw musieliśmy obsłużyć wcześniejsze eventy (UserOrderRaisedEvent), zanim dotarliśmy do kolejnych etapów (UserOrderAcceptedEvent).

To zjawisko mogło prowadzić do naruszenia *SLA* (service level agreement). W moim przypadku do złamania SLA nie doszło, co niestety wydłużyło analizę — alarm dotyczący zbyt długiej transakcji biznesowej mógłby szybciej naprowadzić mnie na sedno problemu.

## Mechanizmy ukryte w systemach event-driven

Analiza mojego przypadku ujawniła klasyczny *feedback loop*, ale to tylko jeden z wielu problemów, które mogą ukrywać się w systemach opartych na eventach. Warto znać inne mechanizmy, które mogą wpływać na skalowanie i stabilność:

•	Feedback loops – eventy generują kolejne eventy w tej samej kolejce lub powiązanych kolejkach, podtrzymując lag i obciążenie systemu.

•	Event amplification – pojedyncze zdarzenie wyzwala lawinę kolejnych eventów, co prowadzi do nieproporcjonalnego wzrostu obciążenia.

•	Queue self-dependency – zależności kolejki od własnego stanu sprawiają, że backlog utrzymuje się mimo zwiększonych zasobów.

Rozpoznanie tych mechanizmów jest kluczowe dla prawidłowego autoskalowania i monitorowania systemu. 

## Wnioski - jak unikać problemów w event-driven architecture?

No, tak - mozna powiedziec -, problem w tym, ze wszystko trafia do tej samej kolejki!
W moim projekcie to by sie nie stalo, bo my mamy oddzielna kolejke pod kazdy typ requestu/eventu - case closed, next!. 
Nie do końca. Mam wrazenie, ze problem twki duzo głębiej. 

Mianowicie kazdy projekt w mojej karierze, w którym był uzyta event-driven architektura (w tej formie lub innej), borykał się z jakimiś problemami. 
Nigdzie nie było to wprowadzone dobrze od początku do końca. I zdecydowana większość tych projektów nie korzystała z zalet płynących z tego podejścia.

W praktyce oznacza to parę rzeczy.

Można powiedzieć: „problem w tym, że wszystko trafiało do jednej kolejki”.
I ktoś mógłby odpowiedzieć: „u mnie tak nie będzie — mamy osobną kolejkę na każdy typ eventu, case closed”.

Niestety — nie do końca.

Mam wrażenie, że problem leży dużo głębiej.

W praktyce niemal każdy projekt, w którym pracowałem i który wykorzystywał podejście event-driven, borykał się z różnymi problemami.
Co więcej — rzadko który faktycznie w pełni korzystał z jego zalet.

Z tego doświadczenia wynika kilka ważnych wniosków.

**1) Event-driven nie lubi być wprowadzany zbyt wcześnie.**

Mam wrazenie, ze zbyt chetnie wskakuje sie w popularne trendy bez analizowania, co tak naprawdę potrzebuję - co wchodzi w skład *MVP* (Minimum Viable Product), czyli absolutnego **minimum** potrzebnego do
realizowania zadan biznesowych na produkcji. 

Rozpoczynamy projekt? Ok, lecimy z mikroserwisami! Jakby uzycie monolitu w poczatkowej fazie godzilo w naszą mądrość, czy poczucie wartości.

Trzeba sobie uzmysłowić, ze *event* to nie request, czy dowolne zdarzenie po stronie serwera, czy uzytkownika. 
*Event* budują reprezentację modelu biznesowego, procesów w nich zachodzących i stanów, w jakich poszczególne byty i procesy mogą się znajdować. 
A zeby zrozumiec procesy biznesowe, potrzeba czasu! Jako programiści mało wiemy o problemach pochodzących z innych domen zycia i biznesu.
Dlatego dajmy sobie czas na zrozumienie i wejscie w ten inny swiat, nim zaczniemy go modelować za pomocą *eventów*.
Zwłaszcza w dobie, gdzie biznes i wymagania potrafia zmienic sie z dnia na dzień.

**A świadectwem prawdziwego zrozumienia jest zawsze prostota - [KISS](https://en.wikipedia.org/wiki/KISS_principle)!**

**2) Event-driven architektura jest skomplikowana!**

Architektura *event driven* wymaga duzego doswiadzenia - bardzo duzego doswiadczenia!
Przemyśl dobrze, czy naprawdę potrzebujesz danego podejścia, aby rozwiązac swój problem.
Moze nie potrzebujesz *event sourcingu*? Moze samo *CQRS* starczy? Moze sa inne rozwiazania, które pomogą osiągnąć podobny efekt? 
A przede wszystkim pomyśl o tym, co moze pójść nie tak, gdy wejdziesz w tą uliczkę.

**Kazda technologia, czy rozwiazanie jest pewnym kompromisem - usprawniamy jedno, komplikujemy inne.**
Dlatego warto się zastanowić, czy naprawde warto. 
A jesli idziesz juz ta droge, rob to powoli - `mala zmiana -> produkcja -> obserwacja -> wnioski i dalsze usprawnienia`.

**3) Event-driven podejście to nie tylko architektura**

Jeśli juz decydujemy się na `event-driven` architektura, pamiętajmy, ze nie podejmujemy tylko decyzji odnośnie architektury. 

To zestaw decyzji, które bezpośrednio wpływają na:

•	sposób pracy z kodem

Event driven wymaga odpowiednich wzorców projektowych, to powoduje sporo boilerplatu w kodzie. 
Repozytoria z kodem zaczynają się mnozyć, powstaje część wspólna (*common*), to później komplikuje zarządzanie zaleznościami...
Jesli chcemy coś zmienić musimy pamiętać o wszysktich miejscach, które musimy dotknąć.
A na tym się nie kończy...

•	**debugowanie i analizowania przypadków z produkcji**

Nie ma nic gorszego od debugowania eventów. Serio! Zwłaszcza, gdy próbujemy rozkminić jakiś przypadek z produkcji! 
Procesy biznesowe ubrane w *eventy* i kod z nim związany robi się naprawdę skomplikowany - duzo skakania między klasami, troche logiki tu, troche tam, 
potencjalne race conditions, cięzej cos zasymulowac i ogólnie ogarnąć całość!

Mała anegdotka: pracowałem kiedyś dla FinTech. Obsługiwaliśmy miliony transakcji dziennie. 
I mimo wszystko, kazdy z programistow (nawet paruletnim stazem w firmie), nie był wstanie szybko i bezblednie znalezc rzeczy w kodzie.
Debugowanie zawsze wiązało się ze skakaniem, szukaniem, przypominaniem sobie, gdzie coś było. 
A to tylko wierzchołek góry lodowej!

•	narzędzia, których będziesz potrzebować

I nie chodzi tu tylko o narzędzia do minotorowania, czy deploymentu. Co zrobisz na produkcji, kiedy twój proces utknie w połowie? Jak go wznowisz?
To oznacza, ze pozwolisz deweloperom na dostęp do produkcji, aby mogli cos recznie wrzucic kolejke, aby odblokować proces.
A to tworzy security risk, wiec to wymaga dotakowych procesów do kontroli i nadzoru. To wymaga dotatkowych narzędzi...

•	oraz – co najważniejsze – sposób monitorowania systemu i jego skalowania

Musisz się zastanowić jak poprawnie monitorować system, aby wiedziec, ze działa i skaluje się jak nalezy.
A to wymaga zrozumienie biznesu, tego, jak uzytkownicy korzystaja z twojej aplikacji czy API. 
Znowu, event driven architektura wymaga zrozumienia!


**4) Event to nie request!**

Znowu, *event* nie obrazuje request HTTP czy GRPC. 
Jesli musisz tylko zapewnic, ze zaden request nie zginie i bedzie przetworzony, to pewnie - wpychaj wszystko do kolejki i przetwarzaj.
Ale zostaw rzeczy związane z *eventami* i skup sie na tym, czego naprawde potrzebujesz.

tem wpada w pętle lub generuje nadmiarowe eventy. Dzięki temu można wcześniej zoptymalizować topologię kolejek i strategie skalowania.


## Podsumowanie

