# Agent Lab — web

Hibrit retrieval ve karar döngüsüne sahip bir araştırma agent'ının anlatıldığı
arayüz. Agent ve RAG servisi ayrı bir Python projesinde yaşar; bu repo yalnızca
web katmanıdır ve bağımsız olarak çalıştırılabilir.

## Durum

Altı sayfa: `/`, `/system` (nasıl çalışır), `/playground`, `/evaluation`,
`/api-setup`, `/about`.

Uygulama varsayılan olarak demo modundadır (`DEMO_MODE=false` yazılmadıkça) ve
bu her sayfada `STATUS: DEMO` etiketiyle görünür.

- **Demo modu (varsayılan):** playground hiçbir ağ isteği yapmaz; sorular
  `content/demo-runs.json` içindeki hazırlanmış koşularla yerel olarak
  eşleştirilir. Örnek korpus açıkça örnek olarak etiketlenir.
- **Canlı mod:** `DEMO_MODE=false` ve `AGENT_API_URL` tanımlıyken kullanıcı
  kendi dokümanlarını yükleyebilir ve onlara soru sorabilir. İstekler Next.js
  sunucu tarafındaki route handler'lardan geçer; tarayıcı backend adresini ve
  hiçbir sırrı görmez.
- **Doküman alanı:** sürükle-bırak yükleme, indeksleme durumu, korpustaki
  dokümanların listesi, chunk sayıları, tek tek kaldırma ve korpusu sıfırlama.
  Yazma işlemleri `UPLOAD_ENABLED` bayrağına bağlıdır; kapalıyken alan salt
  okunur görünür ve nedeni açıkça yazılır.
- **Değerlendirme:** `/evaluation` varsa bir değerlendirme artefaktını okur,
  yoksa yokluğunu açıkça bildirir — sonuç uydurmaz.

## Dil ve tema

Sekiz dil: Türkçe, English, Français, العربية, Español, Português,
中文（简体）, हिन्दी. Seçim bir çerezde saklanır ve sunucuda okunur, bu yüzden
ilk render doğru dilde gelir ve sayfa başlıkları da çevrilir. Arapça seçildiğinde
`dir="rtl"` sunucuda yazılır ve düzen mantıksal özelliklerle yansır.

Aydınlık/karanlık tema `localStorage`'da saklanır; kayıtlı seçim yoksa sistem
tercihi geçerli olur. Seçim sayfa boyanmadan önce uygulanır, böylece yanlış
temada bir kare görünmez.

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:3000
```

Canlı mod (kendi dokümanlarınızı yükleyip soru sorabilmek için), iki terminal:

```bash
# 1) agent + RAG servisi (ayrı depo)
UPLOAD_ENABLED=true uv run uvicorn rag_tr.api.main:app --port 8000

# 2) arayüz
DEMO_MODE=false UPLOAD_ENABLED=true AGENT_API_URL=http://localhost:8000 npm run dev
```

> Tarayıcıda `localhost` kullanın. Next.js geliştirme sunucusu `127.0.0.1`
> üzerinden gelen `/_next/hmr` isteklerini çapraz-köken sayıp engelliyor; bu
> durumda sayfa görünür ama istemci tarafı hidrasyon olmadığı için düğmeler
> tepkisiz kalır.

```bash
npm run lint
npm run typecheck
npm run build
```

## Ortam değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyalayın.

| Değişken | Taraf | Açıklama |
|---|---|---|
| `DEMO_MODE` | sunucu | `"false"` dışındaki her değer demo modu açık tutar |
| `NEXT_PUBLIC_GITHUB_URL` | tarayıcı | Tanımsızsa bağlantı hiç render edilmez |
| `NEXT_PUBLIC_LINKEDIN_URL` | tarayıcı | Tanımsızsa bağlantı hiç render edilmez |

API anahtarları bu repoda **tutulmaz**. Model çağrıları ileride yalnızca sunucu
tarafındaki AI servisi üzerinden yapılacak; hiçbir sır tarayıcıya verilmeyecek.

## Dağıtım (Vercel)

Bu repo Vercel'e olduğu gibi dağıtılır; agent servisi ayrı bir deployable'dır
(Railway benzeri bir platform). Tarayıcı **yalnızca** bu uygulamayla konuşur:
model çağrıları ve backend adresi sunucu tarafında kalır.

```
Tarayıcı → Next.js (Vercel) → /api/ask · /api/upload → FastAPI → Gemini
                                  AGENT_API_URL (sunucu tarafı)
```

### Vercel ortam değişkenleri

| Değişken | Taraf | Önerilen değer | Not |
|---|---|---|---|
| `DEMO_MODE` | sunucu | `true` | `"false"` dışındaki her değer demo modunda bırakır. Canlı mod her ziyaretçi için 2-3 Gemini çağrısı demek; ücretsiz kota bir demoda tükenir. |
| `AGENT_API_URL` | sunucu | agent servisinin kök adresi | **Asla** `NEXT_PUBLIC_` yapılmamalı. Tanımsızsa canlı mod `not_configured` döner. |
| `AGENT_API_TIMEOUT_MS` | sunucu | boş (45000) | İstek zaman aşımı. |
| `UPLOAD_ENABLED` | sunucu | `false` | Dağıtımda kapalı kalmalı: korpus ziyaretçiler arasında paylaşımlı, kullanıcı izolasyonu yok. |
| `NEXT_PUBLIC_GITHUB_URL` | tarayıcı | profil adresi | Tanımsızsa bağlantı hiç render edilmez. |
| `NEXT_PUBLIC_LINKEDIN_URL` | tarayıcı | profil adresi | Aynı davranış. |

Yalnızca `NEXT_PUBLIC_*` değişkenleri tarayıcıya ulaşır ve bunlar herkese açık
profil bağlantılarından ibarettir. Hiçbir API anahtarı bu uygulamada okunmaz:
Gemini yalnızca agent servisi tarafından çağrılır.

`lib/config.ts` sunucu tarafı yapılandırmayı okur ve bilinçli olarak
`lib/ui-config.ts`'ten ayrıdır: istemci bileşenleri yalnızca ikincisinden değer
import eder, böylece sunucuya ait modül tarayıcı paketine hiç girmez. Bir test
derlenmiş paketi tarayıp `AGENT_API_URL`, anahtar adları ve gerçek anahtar
kalıplarının bulunmadığını doğrular.

## Yapı

```
app/              layout + üç sayfa (App Router)
components/       navigation · mode-badge · hero · architecture
                  section-heading · system-flow · footer
lib/config.ts     sunucu tarafı yapılandırma ve gezinme tanımı
```

Mimari akış diyagramı bilinçli olarak anlamsal HTML + CSS ile yazıldı: metin
seçilebilir kalıyor, ekran okuyucu sıralı bir boru hattı olarak okuyor ve dar
ekranda ölçeklenen SVG metni gibi okunamaz hale gelmiyor. Animasyon kütüphanesi
yok; geçişler CSS ile ve `prefers-reduced-motion` saygılı.
