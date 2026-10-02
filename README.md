# Agent Lab — web

Hibrit retrieval ve karar döngüsüne sahip bir araştırma agent'ının anlatıldığı
arayüz. Agent ve RAG servisi ayrı bir Python projesinde yaşar; bu repo yalnızca
web katmanıdır ve bağımsız olarak çalıştırılabilir.

## Durum

P2 — statik iskelet. Üç sayfa (`/`, `/system`, `/about`), gezinme, mod etiketi
ve mimari akış diyagramı. Henüz **hiçbir** backend veya model çağrısı yok:
playground, upload, canlı mod ve değerlendirme sayfası sonraki aşamalara ait.

Uygulama varsayılan olarak demo modundadır (`DEMO_MODE=false` yazılmadıkça) ve
bu her sayfada `STATUS: DEMO` etiketiyle görünür.

## Çalıştırma

```bash
npm install
npm run dev        # http://localhost:3000
```

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
