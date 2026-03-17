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
