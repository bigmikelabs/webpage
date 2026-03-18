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

Można powiedzieć: „problem w tym, że wszystko trafiało do jednej kolejki”.
I ktoś mógłby odpowiedzieć: „u mnie tak nie będzie — mamy osobną kolejkę na każdy typ eventu, case closed”.

Niestety — nie do końca.

Mam wrażenie, że problem leży dużo głębiej.

W praktyce niemal każdy projekt, w którym pracowałem i który wykorzystywał podejście event-driven, borykał się z różnymi problemami.
Co więcej — rzadko który faktycznie w pełni korzystał z jego zalet.

Z tego doświadczenia wynika kilka ważnych wniosków.

**1) Event-driven nie lubi być wprowadzany zbyt wcześnie.**

Zbyt często wskakujemy w modne rozwiązania, zanim dobrze zrozumiemy, czego naprawdę potrzebujemy.

Start projektu? Lecimy z mikroserwisami.
Płatności? Event sourcing.
Odporność? CQRS.

Tylko że…

event to nie jest request.

Eventy modelują procesy biznesowe i ich stany.
A tych nie da się poprawnie zaprojektować bez zrozumienia domeny.

A zrozumienie domeny:

•	wymaga czasu

•	wymaga błędów

•	wymaga iteracji

Dlatego bardzo często lepszym wyborem na start jest prostsze podejście.

**Świadectwem prawdziwego zrozumienia jest zawsze prostota - [KISS](https://en.wikipedia.org/wiki/KISS_principle)!**


**2) Event-driven architektura jest trune (i łatwo to niedocenić)!**

Event-driven architecture wygląda dobrze na diagramach.
W praktyce jest złożona operacyjnie i mentalnie.

Warto zadać sobie kilka pytań:

•	Czy naprawdę potrzebuję event sourcingu?

•	Czy CQRS coś mi daje tu i teraz?

•	Czy prostsze rozwiązanie nie rozwiąże 80% problemu?

Bo każda decyzja architektoniczna to kompromis: **upraszczasz jedno — komplikujesz coś innego**.

Jeśli już wchodzisz w event-driven — rób to iteracyjnie: `mała zmiana → produkcja → obserwacja → wnioski → kolejna zmiana`.

**3) To nie tylko architektura — to sposób pracy**

Decyzja o event-driven zmienia znacznie więcej niż tylko przepływ danych.

Wpływa bezpośrednio na:

---

**a) kod**

Więcej wzorców, więcej boilerplate’u, więcej repozytoriów.
Pojawia się warstwa „common”, zależności między serwisami rosną.
Zmiana jednego elementu często oznacza dotknięcie wielu miejsc.

---

**b) debugowanie (czyli prawdziwy ból)**

Debugowanie systemów event-driven potrafi być naprawdę trudne.

•	dużo skakania po kodzie

•	logika rozproszona w wielu miejscach

•	trudność w odtworzeniu scenariuszy

•	potencjalne race conditions

Z życia: pracowałem w FinTechu obsługującym miliony transakcji dziennie.
I mimo doświadczenia zespołu, debugowanie przypadków produkcyjnych zawsze oznaczało:
szukanie, przypominanie sobie przepływów i składanie historii z kawałków.

---

**c) narzędzia i operacje**

Co robisz, gdy proces utknie w połowie?

•	restartujesz?

•	dorzucasz event ręcznie?

•	dajesz devom dostęp do produkcji?

To szybko prowadzi do:

•	problemów bezpieczeństwa

•	potrzeby dodatkowych narzędzi

•	dodatkowych procesów kontrolnych

Event-driven wymaga świadomego podejścia do operacji, nie tylko kodu.

---

**d) monitoring i skalowanie**

Tu wracamy do głównego tematu artykułu.

Nie wystarczy patrzeć na:

•	CPU

•	latency

•	lag

Musisz rozumieć:

•	jak eventy przepływają przez system

•	co generuje co

•	gdzie powstają pętle

Bez tego bardzo łatwo przeoczyć:

•	feedback loops

•	event amplification

•	ukryte zależności między kolejkami

--- 

**4) Event to nie request**

To jeden z najczęstszych błędów.

Jeśli Twoim celem jest: „żeby request się nie zgubił”

to:

•	wrzuć go do kolejki

•	przetwórz asynchronicznie

•	gotowe

Ale to nie jest event-driven architecture.

Event:

•	reprezentuje zmianę stanu w systemie

•	jest częścią procesu biznesowego

•	niesie znaczenie domenowe

Jeśli tego nie potrzebujesz — nie komplikuj.

## Podsumowanie

Problemy takie jak *feedback loops* czy *event amplification* nie wynikają z „błędnej konfiguracji”.

One wynikają z:

•	zbyt wczesnych decyzji

•	braku zrozumienia przepływu eventów

•	niedoszacowania złożoności systemu

Event-driven to potężne narzędzie.

Ale tylko wtedy, gdy:

•	jest użyte świadomie

•	w odpowiednim momencie

•	i z pełnym zrozumieniem konsekwencji

W przeciwnym razie system zaczyna… żyć własnym życiem.
