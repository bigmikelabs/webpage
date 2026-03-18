## Introduction

Event-driven architecture is incredibly popular these days. Questions about CQRS or event sourcing show up in almost every interview, and many teams jump on the bandwagon right at the start of a project—often before they truly understand the business domain.

Building anything payments-related? *Event sourcing* sounds like the obvious choice.

Want resilience? *CQRS*.

Add *DDD* (domain-driven design) and you’ve got a “modern architecture”.

Sounds great. On paper, everything checks out.

---

The problems start later—on production.

Recently I ran into an interesting case that kept triggering alarms during peak hours.

It involved one of the queues in an event-driven system.

The alert was simple: **the number of messages in the queue (lag) is growing and the system can’t keep up with processing**.
At first glance—a classic issue.

Except:

- lag-based autoscaling was hitting its limits… and it changed nothing

- raising limits didn’t help either

- infrastructure metrics looked healthy:

- database: ~10 ms (p99)

- cache: ~5 ms (p99)

- processing a single message: ~50 ms (p99)

---

So everything was working “as designed”.
And yet the system still couldn’t catch up.

The natural question: if every component is behaving correctly, why doesn’t the whole thing scale and behave the way it should?
The answer wasn’t in the infrastructure or the system parameters.

We had to dig deeper.

## Problem description

In practice, the issue looks like this on the queue/lag chart:

<figure>
<img src="/images/event-loops-inc/feedback-loop.jpg" alt="Event queue with feedback loop" />
<figcaption>Chart 1: An example queue chart showing growing lag caused by a feedback loop in an event-driven system.</figcaption>
</figure>

We can distinguish three characteristic phases:

1. Spike

This is the moment when traffic ramps up and the volume of events “floods” the system, which can’t process them in real time.
At this stage, autoscaling starts to kick in, but it still can’t keep up.

2. Saturation

The phase where the system appears to stabilize—the number of events in the queue stops growing rapidly. On a chart this can look almost like a flat line.
It can suggest that roughly as many events “enter” the queue as “leave” it.
In this phase, autoscaling is already fully active and should start reducing lag. In practice, however, the equilibrium often persists longer than you’d expect.
In my case, I noticed this trend could continue even after peak hours were over.

3. Back to operational

In the final phase, the system finally “unblocks” and starts catching up—events are processed faster and lag gradually decreases.

## Root cause analysis

To understand why autoscaling wasn’t working as expected, I had to take a closer look at the system logic and the code handling events.

During the analysis I discovered that some events in the queue were producing more events, which ended up back in the same queue or in related queues. In my case, the events reflected a state machine for a business process. Example events were defined like this:

- UserOrderRaisedEvent

- UserOrderAcceptedEvent

- UserOrderWaitingForPaymentEvent

- UserOrderPaymentDoneEvent

- UserOrderWaitingForCollectionEvent

- ...plus a good 10 other events related to the business process

It’s not surprising that all of these events went to the same queue—they were part of the same domain.

The end result was that the more the system scaled, the more events it processed, which triggered more business transactions and generated even more events.
A FIFO queue could additionally increase the end-to-end time of a single business transaction, because we first had to handle earlier events (UserOrderRaisedEvent) before reaching later stages (UserOrderAcceptedEvent).

This phenomenon could lead to an *SLA* (service level agreement) violation. In my case the SLA wasn’t broken, which unfortunately prolonged the investigation—an alert about an overly long business transaction would have pointed me to the core of the problem much faster.

## Hidden mechanisms in event-driven systems

The analysis of my case revealed a classic *feedback loop*, but it’s only one of many issues that can hide in event-based systems. It’s worth knowing other mechanisms that can affect scaling and stability:

- Feedback loops – events generate more events in the same queue or related queues, sustaining lag and load.

- Event amplification – a single event triggers an avalanche of subsequent events, leading to a disproportionate increase in load.

- Queue self-dependency – dependencies on the queue’s own state cause backlog to persist despite added resources.

Recognizing these mechanisms is key to proper autoscaling and monitoring.

## Takeaways – how to avoid problems in event-driven architecture?

You could say: “the problem was that everything went to one queue”.
And someone might respond: “that won’t happen to me—we have a separate queue per event type, case closed”.

Unfortunately—not quite.

My impression is the problem runs much deeper.

In practice, almost every project I’ve worked on that used an event-driven approach struggled with various issues.
What’s more—few of them truly leveraged its benefits to the fullest.

From that experience, a few important takeaways emerge.

**1) Event-driven doesn’t like being introduced too early.**

Too often we jump into trendy solutions before we truly understand what we need.

Project start? Let’s do microservices.
Payments? Event sourcing.
Resilience? CQRS.

But…

an event is not a request.

Events model business processes and their states.
And you can’t design those correctly without understanding the domain.

And understanding the domain:

- takes time

- takes mistakes

- takes iteration

That’s why a simpler approach is often the better choice at the start.

**True understanding always shows up as simplicity – [KISS](https://en.wikipedia.org/wiki/KISS_principle)!**

**2) Event-driven architecture is hard (and it’s easy to underestimate)!**

Event-driven architecture looks great on diagrams.
In practice, it’s operationally and mentally complex.

It’s worth asking yourself a few questions:

- Do I really need event sourcing?

- Does CQRS give me anything here and now?

- Would a simpler solution solve 80% of the problem?

Because every architectural decision is a trade-off: **you simplify one thing—you complicate something else**.

If you go event-driven, do it iteratively: `small change → production → observe → learn → next change`.

**3) It’s not just architecture—it’s a way of working**

Choosing event-driven changes far more than data flow.

It directly affects:

---

**a) code**

More patterns, more boilerplate, more repositories.
A “common” layer appears, dependencies between services grow.
Changing one element often means touching many places.

---

**b) debugging (the real pain)**

Debugging event-driven systems can be genuinely hard.

- lots of jumping around the codebase

- logic scattered across many places

- difficulty reproducing scenarios

- potential race conditions

From experience: I worked in a FinTech processing millions of transactions per day.
Even with a seasoned team, debugging production cases always meant digging, recalling flows, and reconstructing the story from fragments.

---

**c) tools and operations**

What do you do when a process gets stuck halfway through?

- restart it?

- manually inject an event?

- give developers production access?

That quickly leads to:

- security issues

- a need for additional tooling

- extra control processes

Event-driven requires an intentional operations approach—not just code.

---

**d) monitoring and scaling**

This brings us back to the main topic of the article.

It’s not enough to look at:

- CPU

- latency

- lag

You have to understand:

- how events flow through the system

- what triggers what

- where loops can form

Without that, it’s easy to miss:

- feedback loops

- event amplification

- hidden dependencies between queues

---

**4) An event is not a request**

This is one of the most common mistakes.

If your goal is: “don’t lose the request”

then:

- put it on a queue

- process it asynchronously

- done

But that’s not event-driven architecture.

An event:

- represents a state change in the system

- is part of a business process

- carries domain meaning

If you don’t need that—don’t complicate things.

## Summary

Problems like *feedback loops* or *event amplification* don’t come from “bad configuration”.

They come from:

- making decisions too early

- not understanding event flows

- underestimating system complexity

Event-driven is a powerful tool.
But only when:

- used deliberately

- at the right time

- with full awareness of the consequences

Otherwise, the system starts to… live its own life.