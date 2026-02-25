## Introduction and expectations

Intuitively, you might expect a binary protocol (gRPC + Protobuf) to be faster than text-based JSON over HTTP (especially in the older 1.1 version).

Running the service locally, we can already see the first differences.

```
$ go test -bench=. -benchmem  -benchtime=30s
...
BenchmarkGRPC/grpc.GetFeature()-10         	   19750	     56548 ns/op
...
BenchmarkHTTP/2/http.GetFeature()-10           16590	     72107 ns/op
...
BenchmarkHTTP1/http.GetFeature()-10        	   24290	     49005 ns/op
...
PASS
```

Here the benchmarks unfortunately measure mainly runtime and serialization cost, not behaviour under real load and at the transport layer. So local results do not necessarily correlate with what happens under heavy load in production.

Recently in one project I introduced [Google FCM](https://firebase.google.com/docs/cloud-messaging) on the backend for push notifications. I was using [multicast](https://firebase.google.com/docs/reference/admin/java/reference/com/google/firebase/messaging/MulticastMessage) messages to deliver one message to many devices of the same user at once. In its default configuration FCM uses the HTTP protocol.

After deploying to production I quickly ran into the first issues. Even though during the design phase and development we followed [Google’s recommended best practices](https://firebase.google.com/docs/cloud-messaging/scale-fcm#use-fcm), the service did not behave the way we wanted. [Sending multicast](https://pkg.go.dev/github.com/appleboy/go-fcm#Client.SendMulticast) took surprisingly long—*p95* and *p99* metrics showed up to *500ms*. Stranger still, this latency was independent of traffic: low traffic at night and peak hours did not differ at all. If this were some smaller company’s API, I would not have batted an eye. But we are talking about Google! Something had to be going on.

I started the analysis by checking the client configuration. I made sure my client was negotiating *HTTP/2* here. Everything looked fine, but I could not find much detail in the documentation—with Google that is hardly a surprise! Analysing the client did not help much either. The only outcome was disappointment when I saw that [send multicast](https://github.com/firebase/firebase-admin-go/blob/v3.13.0/messaging/messaging_batch.go#L51) under the hood turns the *batch* into individual messages and sends them one after another.

```go
func (mm *MulticastMessage) toMessages() ([]*Message, error) {
	if len(mm.Tokens) == 0 {
		return nil, errors.New("tokens must not be nil or empty")
	}
	if len(mm.Tokens) > maxMessages {
		return nil, fmt.Errorf("tokens must not contain more than %d elements", maxMessages)
	}

	var messages []*Message
	for _, token := range mm.Tokens {
		temp := &Message{
			Token:        token,
			Data:         mm.Data,
			Notification: mm.Notification,
			Android:      mm.Android,
			Webpush:      mm.Webpush,
			APNS:         mm.APNS,
			FCMOptions:   mm.FCMOptions,
		}
		messages = append(messages, temp)
	}

	return messages, nil
}
```

So it was time to move from HTTP to gRPC…

## FCM and gRPC

Switching FCM from *HTTP* to *gRPC* only requires adding a few options to the client configuration:

```
	fb, err := firebase.NewApp(
		context.Background(),
		&firebase.Config{
			ProjectID: fcmProjectID,
		},
		firebaseoption.WithCredentialsJSON(credsJSON),
		// GRPC settings
		firebaseoption.WithGRPCDialOption(grpc.WithKeepaliveParams(keepalive.ClientParameters{
			Time:                fcmGRPCTime,
			Timeout:             fcmGRPCTimeout,
			PermitWithoutStream: true, // for keep-alive
		})),
		firebaseoption.WithGRPCDialOption(grpc.WithDefaultServiceConfig(`{"loadBalancingConfig": [{"round_robin":{}}]}`)),
		firebaseoption.WithGRPCDialOption(grpc.WithPerRPCCredentials(oauth.TokenSource{TokenSource: tokenSourceFromCredsJson})),
	)
```

And that’s it! In theory, release to production, switch traffic and… Same results. Okay, slightly better—*p99* for *send_multicast* dropped from *500ms* to *400ms*/*450ms*—but still too slow! The product sends millions of notifications at peak times that need to be delivered as fast as possible. I kept digging; I must have done something wrong or forgotten something. Then the first peak hit and… eureka! *p99* latencies started to drop from *400ms* to *250ms*.

<figure>
<img src="/images/grpc-vs-http2/fcm-send-multicast.jpg" alt="FCM send multicast chart" />
<figcaption>Chart 1: FCM - sendmulticast</figcaption>
</figure>

Or if you prefer a heatmap…

<figure>
<img src="/images/grpc-vs-http2/fcm-send-multicast-heat.jpg" alt="FCM send multicast heatmap chart" />
<figcaption>Chart 2: FCM - sendmulticast heatmap</figcaption>
</figure>

<figure>
<img src="/images/grpc-vs-http2/fcm-load.jpg" alt="FCM - send notifications by status" />
<figcaption>Chart 3: FCM - send notifications by status</figcaption>
</figure>

As you can see in charts 1 and 3, higher traffic “warms up” the connection. The more we send, the faster and smoother it gets. That would be normal if there were periods when we send nothing and the connection “cools down”. But here the client is always sending something, more or less, but constantly. So the connection should not go *idle*. The difference likely did not come from HTTP/2 itself but from the client implementation and how it generated traffic. The protocol was the same; the way it was used was different. I do not like to leave a topic without understanding every detail, so I had to dig deeper.

## Shared optimisations under high load (HTTP/2 and gRPC)

Under heavy load, both HTTP/2 and gRPC benefit from optimisations that sit below the application layer—in TLS, TCP, and the OS kernel.

1) **TCP write coalescing (transport layer)**

Under intense traffic, many small *write* operations can be merged into larger chunks before they hit the network. As a result:
- the number of *syscalls* drops
- fewer small TCP segments are created
- MSS (Maximum Segment Size) is used better
- TCP/IP header overhead decreases
- CPU cost per request goes down

This can be helped by:
- kernel buffering
- *TCP_CORK* (on some stacks)
- [Nagle’s algorithm](https://en.wikipedia.org/wiki/Nagle%27s_algorithm) (depending on configuration, when *TCP_NODELAY* is not set)

Effect: lower overhead per request and better throughput under high concurrency.

2) **HTTP/2 multiplexing**

HTTP/2 allows many parallel streams over a single TCP connection.

That means:
- no need to open new connections
- fewer TLS handshakes
- better use of one “warm” connection
- larger chunks of data going into the TCP/TLS stack

gRPC uses this because it runs on HTTP/2.

3) **TLS record batching (encryption layer)**

TLS packs application data into so-called TLS records (typically up to ~16 KB). Under higher load, data fills the TLS buffer faster, which allows:
- larger records
- fewer small fragments
- fewer socket flushes

That leads to:
- better aggregation by TCP
- fewer packets
- lower cryptographic overhead per byte

This mechanism is independent of whether you use REST (HTTP/1.1), HTTP/2, or gRPC—it sits below the application protocol layer.

## Why gRPC often gains more under heavy load

The mechanisms above (TCP coalescing, TLS batching, HTTP/2 multiplexing) apply to all protocols that use HTTP/2 and TLS. The difference is how a given client generates traffic and manages connections.

1) **Long-lived, shared connections**

A gRPC client typically:
- keeps one or a few long-lived TCP/TLS connections
- sends all requests as separate HTTP/2 streams
- rarely closes the connection

As a result:
- the connection stays “warm” (no handshake per request)
- the TCP/TLS buffer stays full
- write coalescing is more effective
- TLS can produce larger records

In practice that means better use of the transport as concurrency grows.

2) **Naturally high concurrency**

gRPC is designed for:
- parallel requests
- streaming (client/server/bidirectional)
- an asynchronous call model

At high RPS, many streams “fill” one TCP connection at once, which:
- stabilises data flow
- reduces small flushes
- improves aggregation in TLS and TCP

So the pipeline is loaded more evenly.

3) **Lower overhead per request (framing + payload)**

gRPC uses Protobuf (binary) instead of JSON (text), which reduces payload size and serialization cost.

## Summary

gRPC does not have to be visibly faster than HTTP/2 right away. Both use the same transport mechanisms (HTTP/2, TLS, TCP), and the real differences come mainly from:
- how connections are managed
- the level of concurrency
- and the payload format (Protobuf vs JSON)

With low traffic the gap can be marginal. It is only at high RPS that per-request cost is amortised, the pipeline is filled better, and the transport layer is used more efficiently.

gRPC does not win because it is “binary”. It wins when the architecture and load let you fully use the transport layer.

Does that mean it was a mistake not to deploy *FCM* with the *gRPC client* from day one? Absolutely **no**.

Architecture should evolve iteratively: *problem → small change → production → observe → improve*.

The service should stay as simple as possible—as long as it meets performance and business requirements. Every extra technology (e.g. gRPC) adds cost: complexity, operations, monitoring, debugging.

If we stick to the [KISS](https://en.wikipedia.org/wiki/KISS_principle) principle, changes are easy to introduce when they are actually needed. Avoiding over-engineering is not a lack of ambition or technical knowledge—it is making conscious decisions based on real needs, not hypothetical scenarios.
