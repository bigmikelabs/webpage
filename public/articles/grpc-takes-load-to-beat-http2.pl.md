## Wstęp i oczekiwania

Intuicyjnie można oczekiwać, że binarny protokół (gRPC + Protobuf) będzie szybszy niż tekstowy JSON po HTTP (zwłaszcza w starszej wersji 1.1). 

Odpalając serwis lokalnie, możemy już zauważyć pierwsze różnice.

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

Tutaj benchmarki mierzą głównie niestety jedynie koszt runtime i serializacji, a nie zachowanie przy realnym obciążeniu i warstwie transportowej.
Dlatego wyniki lokalne nie muszą korelować z tym, co dzieje się pod dużym obciążeniem w produkcji.

Ostatnio w jednym z projektów wprowadzałem po stronie backend'u [Google FCM](https://firebase.google.com/docs/cloud-messaging) dla push notyfikacji. 
Używałem tam wiadomości typu [multicast](https://firebase.google.com/docs/reference/admin/java/reference/com/google/firebase/messaging/MulticastMessage), aby móc dostarczyć jedną wiadomość do wielu urządzeń tego samego użytkownika jednocześnie. W domyślnej konfiguracji FCM używa protokołu HTTP. 

Po wdrożeniu na produkcję szybko natrafiłem na pierwsze problemy. Mimo iż podczas fazy design i samego dewelopmentu przestrzegaliśmy [dobrych zasad zalecanych przez Google](https://firebase.google.com/docs/cloud-messaging/scale-fcm#use-fcm), serwis nie zachowywał się tak, jakbyśmy chcieli. 
[Wysyłanie multicast](https://pkg.go.dev/github.com/appleboy/go-fcm#Client.SendMulticast) trwało niespodziewanie długo, bo metryki *p95* i *p99* pokazywały aż *500ms*.
Co dziwniejsze czas ten występował niezależnie od ruchu, tj. mały ruch w nocy i godziny szczytu nie różniły się od siebie niczym.
Gdybyśmy rozmawiali tutaj o API mniejszej firmy, to nic bym nie powiedział. Ale mamy do czynienia tutaj z Google! Coś musiało być więc na rzeczy.

Inwestygację rozpocząłem od sprawdzenia konfiguracji klienta. Sprawdziłem oczywiście, czy mój klient negocjuje tutaj połączenie po *HTTP/2*.
Wszystko wydawało się w porządku, ale w dokumentacji za wiele szczegółów nie znalazłem - w przypadku Google nie jest to zaskoczeniem! 
Również analiza klienta na niewiele się zdała. Tutaj jedynie przyszło rozczarowanie, widząc, że [send multicast](https://github.com/firebase/firebase-admin-go/blob/v3.13.0/messaging/messaging_batch.go#L51) pod spodem tłumaczy *batch* na pojedyncze wiadomości i wysyła je jedną po drugiej. 

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

Przyszedł więc czas, aby przejść z HTTP na gRPC...  

## FCM i gRPC 

Przełączenie FCM z *HTTP* na *gRPC* wiąże się jedynie z dodaniem paru opcji do konfiguracji klienta:

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

I gotowe! W teorii, release na produkcję, przełączamy ruch i... Dalej te same wyniki. Okay, ciut lepsze, bo *p99* dla *send_multicast* zmalało z *500ms* do *400ms*/*450ms*, ale to dalej za wolno!
Produkt wysyła miliony notyfikacji w godzinach szczytowych, które muszą być dostarczone jak najszybciej. Sprawdzam dalej, musiałem coś zrobić źle, o czymś zapomnieć.
Aż przychodzi pierwszy peak i.... eureka! Czasy *p99* zaczęły spadać z *400ms* -> *250ms*.

<figure>
<img src="/images/grpc-vs-http2/fcm-send-multicast.jpg" alt="FCM send multicast chart" />
<figcaption>Wykres 1: FCM - sendmulticast</figcaption>
</figure>

Albo jeśli ktoś woli operować na heatmapie...

<figure>
<img src="/images/grpc-vs-http2/fcm-send-multicast-heat.jpg" alt="FCM send multicast heatmap chart" />
<figcaption>Wykres 2: FCM - sendmulticast heatmap</figcaption>
</figure>

<figure>
<img src="/images/grpc-vs-http2/fcm-load.jpg" alt="FCM - send notifications by status" />
<figcaption>Wykres 3: FCM - send notifications by status</figcaption>
</figure>

Jak widać na wykresach 1 i 3, większy ruch powoduje "dogrzewanie" połączenia. Czyli im więcej staramy się wysłać, tym szybciej i sprawniej to idzie. I byłoby to normalne, gdy były okresy, gdzie w ogóle nic nie wysyłamy i połączenie "stygnie".
Ale tutaj klient cały czas coś wysyła, mniej lub więcej, ale jednak. Dlatego połączenie nie powinno przechodzić w status *idle*. 
Różnica prawdopodobnie wynikała nie z samego protokołu HTTP/2, lecz z implementacji klienta i sposobu generowania ruchu. Protokół był ten sam. Inny był sposób jego wykorzystania.
Nie lubię odchodzić od tematu, gdy nie rozumiem wszystkiego w najmniejszych szczegółach, więc trzeba było poszperać dalej.


## Wspólne usprawnienia dla dużego ruchu (HTTP/2 i gRPC)

Przy dużym obciążeniu zarówno HTTP/2, jak i gRPC korzystają z mechanizmów optymalizacyjnych działających poniżej warstwy aplikacyjnej — w TLS, TCP i kernelu systemu operacyjnego.

1) **TCP write coalescing (warstwa transportowa)**

Przy intensywnym ruchu wiele małych operacji *write* może zostać połączonych w większe porcje danych zanim trafią do sieci. Dzięki temu:
- zmniejsza się liczba *syscalli*
- powstaje mniej małych segmentów TCP
- lepiej wykorzystywany jest MSS (Maximum Segment Size)
- spada narzut nagłówków TCP/IP
- obniża się koszt CPU per request

Mechanizm ten może być wspierany przez:
- buforowanie w kernelu
- *TCP_CORK* (w niektórych implementacjach)
- [algorytm Nagle’a](https://en.wikipedia.org/wiki/Nagle%27s_algorithm) (w zależności od konfiguracji, jeśli *TCP_NODELAY* nie jest ustawione)

Efekt: zmniejszenie narzutu per request i lepsza przepustowość przy dużym concurrency.

2) **Multiplexing HTTP/2**

HTTP/2 umożliwia przesyłanie wielu równoległych streamów w jednym połączeniu TCP.

Oznacza to:
- brak konieczności otwierania nowych połączeń
- mniej handshake TLS
- lepsze wykorzystanie jednego „rozgrzanego” połączenia
- większe porcje danych trafiające do stosu TCP/TLS

gRPC korzysta z tego mechanizmu, ponieważ działa na HTTP/2.

3) **TLS record batching (warstwa szyfrowania)**

TLS pakuje dane aplikacyjne w tzw. TLS records (zwykle do ~16 KB). Przy większym loadzie dane szybciej trafiają do bufora TLS, co pozwala generować:
- większe rekordy
- mniej małych fragmentów
- mniej flushów socketu

To prowadzi do:
- lepszej agregacji przez TCP
- mniejszej liczby pakietów
- niższego narzutu kryptograficznego per bajt

Mechanizm ten działa niezależnie od tego, czy używany jest REST (HTTP/1.1), HTTP/2 czy gRPC — ponieważ znajduje się poniżej warstwy protokołu aplikacyjnego.

## Dlaczego gRPC częściej zyskuje więcej przy dużym ruchu

Mechanizmy opisane wcześniej (TCP coalescing, TLS batching, multiplexing HTTP/2) działają dla wszystkich protokołów korzystających z HTTP/2 i TLS.
Różnica polega na tym, jak dany klient generuje ruch i zarządza połączeniami.

1) Długotrwałe, współdzielone połączenia

Klient gRPC standardowo:
- utrzymuje jedno lub kilka długotrwałych połączeń TCP/TLS
- wysyła wszystkie requesty jako osobne streamy HTTP/2
- rzadko zamyka połączenie

Dzięki temu:
- połączenie jest „rozgrzane” (brak handshake przy każdym request)
- bufor TCP/TLS jest stale wypełniony
- łatwiej o efektywne write coalescing
- TLS może generować większe rekordy

W praktyce oznacza to lepsze wykorzystanie transportu przy rosnącym concurrency.

2) Naturalnie wysoki poziom równoległości

gRPC jest projektowane pod:
- równoległe requesty
- streaming (client/server/bidirectional)
- asynchroniczny model wywołań

Przy wysokim RPS wiele streamów jednocześnie „wypełnia” jedno połączenie TCP, co:
- stabilizuje przepływ danych
- zmniejsza liczbę małych flushów
- poprawia agregację w TLS i TCP

Dzięki temu pipeline jest bardziej równomiernie obciążony.

3) Mniejszy narzut per request (framing + payload)

gRPC używa Protobuf (binary) zamiast JSON (text), co zmniejsza payload i koszt serializacji.

## Podsumowanie

gRPC nie musi być od razu widocznie szybsze od HTTP/2.
Oba rozwiązania korzystają z tych samych mechanizmów transportowych (HTTP/2, TLS, TCP), a realne różnice wynikają głównie z:
- sposobu zarządzania połączeniami
- poziomu równoległości
- oraz formatu payloadu (Protobuf vs JSON)

Przy niewielkim ruchu różnice mogą być marginalne.
Dopiero przy dużym RPS zaczyna działać amortyzacja kosztów per request, lepsze wypełnienie pipeline’u oraz efektywniejsze wykorzystanie warstwy transportowej.

gRPC nie wygrywa dlatego, że jest „binarny”. Wygrywa wtedy, gdy architektura i obciążenie pozwalają w pełni wykorzystać warstwę transportową.

Czy to oznacza, że błędem było niewdrożenie *FCM* od razu z *klientem gRPC*? Absolutnie **nie**.

Architektura powinna rozwijać się iteracyjnie: *problem → mała zmiana → produkcja → obserwacja → usprawnienie*.

Serwis powinien być możliwie prosty — tak długo, jak spełnia wymagania wydajnościowe i biznesowe.
Każda dodatkowa technologia (np. gRPC) wprowadza koszty: złożoność, operacyjność, monitoring, debugging.

Jeśli trzymamy się zasady [KISS](https://en.wikipedia.org/wiki/KISS_principle) principle, zmiany są łatwe do wprowadzenia wtedy, gdy rzeczywiście stają się potrzebne.
Brak overengineeringu nie oznacza braku ambicji, czy wiedzy technicznej — oznacza świadome podejmowanie decyzji w oparciu o realne potrzeby, a nie potencjalne scenariusze.