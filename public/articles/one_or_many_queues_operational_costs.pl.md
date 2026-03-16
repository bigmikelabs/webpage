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