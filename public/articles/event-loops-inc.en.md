
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


## Wstęp 

Event-driven architecture jest bardzo popularna. Pytanie o CQRS albo event-sourcing jest niemal bankowe na większości rozmów o pracę. 
Wiele projektów ochoczo wskakuje w ten nurt od samego początku istnienia. 
Masz coś związanego z płatnościami? To event sourcing jest niezbędny! 
Musisz zapewnić, ze requesty będą przetworzone niezaleznie od awarii? Jedziemy z CQRS! 




Problem polega na tym, ze eventy i wszystko, co z nimi związane to nie tylko decyzja architektoniczna. 

Problemem jest tutaj 

Projekty wdrazają owe podejście od samego początku.



## Materialy / brudnopis (nie zmieniaj!)
One Queue or Many? The Hidden Operational Costs of Event Topology

Title
One Queue or Many? The Hidden Operational Costs of Event Topology


1. Introduction – Queues Are Not Just Transport

Most event-driven systems treat queues as simple pipes:
producer → queue → consumer.

In practice, queue topology influences:
- autoscaling
- monitoring and observability
- system stability
- operational costs

Queue design is therefore an architectural decision, not just an implementation detail.


2. Common Event Queue Topologies

2.1 Single Queue (All Events in One Stream)

events
  - user_created
  - order_paid
  - invoice_sent

Pros:
- simple architecture
- easy replay
- good fit for CDC pipelines

Cons:
- mixed workloads
- harder monitoring
- difficult autoscaling


2.2 Queue Per Domain

user-events
order-events
payment-events

Pros:
- domain isolation
- easier scaling
- clearer observability

Cons:
- more infrastructure
- more operational overhead


2.3 Queue Per Event Type

user_created
order_paid
invoice_sent

Pros:
- clean contracts
- consumer independence
- precise scaling

Cons:
- topic explosion
- governance complexity


3. Consequences for Autoscaling

Many systems scale consumers based on:
- queue length
- consumer lag
- backlog

Mixed workloads in one queue can lead to inefficient scaling.

Example:
analytics events = 90%
email events = 10%

Autoscaler scales email workers because analytics traffic fills the queue.

Key insight:
Mixed workloads break autoscaling assumptions.


4. Consequences for Monitoring and Observability

Single queue:
events backlog = 80k

But what is actually happening?

Multiple queues:
analytics-events = 79k
email-events = 1k

Benefits:
- easier debugging
- better visibility
- clearer operational signals


5. Hidden Coupling Through Shared Queues

Multiple services sharing one queue:

service A → queue
service B → queue
service C → queue

Traffic spike in service A may impact latency of B and C.

Key insight:
Logical isolation does not guarantee runtime isolation.


6. Feedback Loops and Event Amplification

Common pipeline pattern:

queue → consumer → new event → queue

If events return to the same queue, systems may produce:

- feedback loops
- event amplification
- event storms

Consumers may unintentionally process their own events.


7. Cost Implications

Single queue:
+ fewer topics
+ simpler infrastructure

But:
- inefficient scaling
- wasted compute resources

Multiple queues:
+ more precise scaling
+ better workload isolation

But:
- more infrastructure
- higher operational complexity


8. When to Choose Each Approach

Single queue works well when:
- workloads are homogeneous
- event volume is moderate
- CDC pipelines are used

Queue per domain works well when:
- services scale independently
- domains are clearly separated
- different SLAs exist

Queue per event type works well when:
- microservices are highly decoupled
- consumers are independent
- workloads differ significantly


9. Practical Design Guidelines

Some practical rules:

If consumers scale independently → separate queues

If workloads are very different → separate queues

If autoscaling depends on queue length → avoid mixing workloads

Queues are not just transport.
They shape the operational behavior of your system.


10. Conclusion

Event queue topology directly affects:

- scaling behavior
- monitoring quality
- failure modes
- operational cost

Choosing the right topology is an architectural decision that should be made deliberately, not by default.


To zjawisko można opisać jako:
	•	feedback loops
	•	event amplification
	•	queue self-dependency