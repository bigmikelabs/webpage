<!-- ![gRPC vs HTTP/2 header](/images/grpc-vs-http2/header.jpg) -->

## 1️⃣ Wstęp i oczekiwania

Większość osób zakłada, że gRPC jest od razu szybsze od klasycznego HTTP/JSON. I rzeczywiście, przy pojedynczych requestach różnica jest minimalna, często niemierzalna.

Jednak nasze testy na API FCM pokazują ciekawą obserwację:

Ruch / Protokół	p99 latency
HTTP 10k/min	500 ms
HTTP 100k/min	500 ms
gRPC 10k/min	500 ms
gRPC 100k/min	200 ms
Jak widać, prawdziwa przewaga gRPC ujawnia się dopiero przy wysokim natężeniu ruchu.

To potwierdza też dokumentacja Microsoftu, gdzie wskazano, że gRPC skaluje lepiej pod dużym loadem i w scenariuszach wymagających niskiego p99 latency.

⸻

2️⃣ Wspólne usprawnienia dla dużego ruchu (HTTP/2 i gRPC)

Niektóre mechanizmy przyspieszające transport działają dla obu protokołów, gdy ruch jest duży:
	•	TCP coalescing / write coalescing
Kernel TCP łączy małe write’y w większe segmenty przed wysłaniem, zmniejszając liczbę syscalls i pakietów. Dzięki temu spada liczba logicznych RTT potrzebnych na przesłanie danych.
Warto podkreślić: zarówno HTTP/2, jak i gRPC korzystają z tego mechanizmu. Różnica w efekcie widoczna w testach wynika głównie z tego, jak ruch jest generowany.
	•	Multiplexing HTTP/2
Pozwala przesyłać wiele równoległych streamów w jednym połączeniu TCP, co redukuje narzut otwierania nowych połączeń i TLS handshake.
	•	TLS record batching
Przy dużym loadzie TLS recordy mogą być większe i mniej flushowane, co poprawia efektywność transportu.

⸻

3️⃣ Jak gRPC zarządza połączeniami i dlaczego zyskuje więcej

gRPC dodatkowo korzysta ze swojej architektury klienta:
	•	Długie, multiplexowane połączenia
Wszystkie requesty idą w jednym lub kilku stale otwartych połączeniach TCP/TLS, a każdy request w osobnym streamie.
	•	Binarne framing + Protobuf
Każdy message to [1B flag][4B length][payload], minimalny nagłówek i mniejszy payload niż JSON → mniej kopiowania w runtime i mniejsza fragmentacja pakietów.

Schemat logiczny:

gRPC przy niskim loadzie (10k RPS)

TCP/TLS Connection
+—————————––+
| Stream1  (active)             |
| Stream2  (idle)               |
| Stream3  (idle)               |
+—————————––+
Result: pipeline niepełny → p99 ~500ms

gRPC przy wysokim loadzie (100k RPS)

TCP/TLS Connection
+––––––––––––––––––––––––––+
| Stream1 | Stream2 | Stream3 | Stream4 | … StreamN |
+––––––––––––––––––––––––––+
Result: pipeline pełny, TLS coalescing → p99 ~200ms

HTTP/JSON przy wysokim loadzie

TCP/TLS Connections (wiele)
+——+   +——+   +——+
| Req1 |   | Req2 |   | Req3 |
+——+   +——+   +——+
Result: wiele połączeń, JSON overhead nie amortyzowany → p99 ~500ms

W skrócie: przy wysokim RPS gRPC wykorzystuje pełen potencjał multiplexingu i pipeline w jednym connection, a binarny framing amortyzuje per-request overhead. HTTP/JSON nie korzysta w tym stopniu z multiplexingu, więc p99 pozostaje stabilne.

⸻

4️⃣ Podsumowanie
	•	gRPC nie zawsze jest od razu szybsze — przy niskim ruchu różnice mogą być minimalne.
	•	Prawdziwe korzyści ujawniają się przy wysokim loadzie dzięki:
	•	pipeline i multiplexing HTTP/2 w długich połączeniach
	•	binarnemu framingowi i mniejszemu payloadowi Protobuf
	•	efektowi TCP coalescing, który w połączeniu z gRPC jest bardziej efektywnie wykorzystywany
	•	HTTP/JSON pozostaje stabilne, ale nie amortyzuje overheadu tak dobrze → p99 pozostaje na poziomie ~500 ms
	•	Obserwacja ta jest zgodna z praktykami wskazanymi w dokumentacji Microsoftu dla ASP.NET Core gRPC

Kluczowy insight: większy ruch = pipeline pełny → gRPC w pełni wykorzystuje możliwości HTTP/2 → znacząca poprawa latency.

⸻