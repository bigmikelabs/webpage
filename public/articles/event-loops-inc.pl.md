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

## Lessons Learned: Jak unikać problemów z feedback loops

Doświadczenie z mojej analizy pokazało, że nie zawsze większe zasoby lub agresywne autoskalowanie rozwiążą problem. 
Kluczowe jest zrozumienie, co w ogóle trafia do kolejki i jak eventy wpływają na siebie nawzajem. Oto kilka lekcji, które warto mieć na uwadze:
	
1.	Świadomie projektuj topologię kolejek
Jedna kolejka dla wszystkich eventów wygląda prosto i elegancko, ale w praktyce może wpaść w pułapkę feedback loop. Rozdzielanie eventów na kolejki wg domeny lub typów eventów pozwala lepiej kontrolować skalowanie i obciążenie. Dzięki temu auto-skalowanie reaguje na rzeczywiste potrzeby, a nie na echo generowane przez inne eventy.

2.	Identyfikuj event amplification
Jeśli jedno zdarzenie może wyzwalać kilka kolejnych, warto rozważyć ograniczenia lub dedykowane mechanizmy kontroli. Na przykład: batchowanie generowanych eventów, agregacja lub wprowadzenie throttlingu. Dzięki temu unikniesz lawiny eventów, która może „zalewać” system w godzinach szczytu.

3.	Zwracaj uwagę na zależności kolejki od własnego stanu (queue self-dependency)
Eventy, które trafiają z powrotem do tej samej kolejki lub powiązanej kolejki, mogą prowadzić do sytuacji, w której backlog utrzymuje się nawet przy dostępnych zasobach. W takich przypadkach warto przemyśleć mechanizm priorytetyzacji eventów lub wprowadzić separację krytycznych i mniej istotnych zdarzeń.

4.	Monitoruj nie tylko liczby, ale też przepływy
Metryki typu lag czy długość kolejki to za mało. Obserwuj też połączenia między eventami: które eventy wyzwalają kolejne i w jakim tempie. Wizualizacja przepływu eventów pomaga wychwycić potencjalne feedback loops i zapobiec problemom zanim staną się krytyczne.

5.	Testuj scenariusze „co jeśli” w kontrolowanym środowisku
Symulacja zwiększonego ruchu lub wprowadzenie testowych eventów pozwala zobaczyć, czy system wpada w pętle lub generuje nadmiarowe eventy. Dzięki temu można wcześniej zoptymalizować topologię kolejek i strategie skalowania.


