# n8n Chatbot Demo Arayüzü

Bu proje, n8n üzerinde oluşturduğunuz sohbet akışını modern bir React arayüzüyle web sitesine gömebilmeniz için hazırlanmış örnek bir front-end uygulamasıdır. Arayüz tek bir sohbet ekranından oluşur ve n8n webhook'unuza REST isteği göndererek yanıtları ziyaretçiye gösterir.

## Başlarken

### Gereksinimler

- Node.js 18 veya üstü
- npm 9 veya üstü
- Halihazırda çalışan bir n8n instance'ı ve webhook URL'si

### Kurulum

1. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

2. `.env.example` dosyasını kopyalayın ve gerçek webhook adresinizi ekleyin:

   ```bash
   cp .env.example .env
   ```

   `.env` içerisine n8n webhook adresinizi yazın:

   ```ini
   VITE_N8N_CHAT_WEBHOOK_URL=https://sunucu-adresiniz/webhook/chatbot
   ```

3. Geliştirme sunucusunu başlatın:

   ```bash
   npm run dev
   ```

   Tarayıcı otomatik olarak `http://localhost:5173` adresine açılır. Sohbet kutusunu kullanarak webhook'unuzu test edebilirsiniz.

### Üretime Alma

Vite ile üretim için build almak:

```bash
npm run build
```

Komut `dist/` klasöründe statik dosyalar oluşturur. Bu dosyaları dilediğiniz statik barındırma servisine (Vercel, Netlify, AWS S3 vb.) yükleyebilirsiniz.

## n8n Webhook'unu Bağlamak

Sohbet bileşeni, her mesaj gönderildiğinde `VITE_N8N_CHAT_WEBHOOK_URL` ortam değişkeniyle tanımladığınız n8n webhook adresine `POST` isteği gönderir. Gönderilen gövde yapısı aşağıdaki gibidir:

```json
{
  "message": "Kullanıcının son mesajı",
  "history": [
    { "role": "assistant", "content": "Merhaba!" },
    { "role": "user", "content": "Selam" }
  ]
}
```

Webhook'unuzun bu yapıyı kabul edip aşağıdaki gibi bir JSON yanıt vermesi gerekir:

```json
{
  "reply": "n8n tarafından üretilen yanıt"
}
```

> İpucu: n8n içerisinde bir **Webhook Trigger** düğümü kullanabilir ve ardından sohbet motorunuz veya OpenAI düğümlerinizle devam ederek `reply` alanını doldurabilirsiniz.

### CORS Ayarları

Uygulamanın tarayıcıdan webhook'a erişebilmesi için n8n instance'ınızda CORS'un etkin olduğundan emin olun. n8n sürüm 0.224.0 ve sonrası için `N8N_DEFAULT_CORS_ALLOWED_ORIGINS` ortam değişkenini React uygulamanızın barınacağı domain'i içerecek şekilde ayarlayabilirsiniz. Lokal geliştirme için örnek ayar:

```bash
N8N_DEFAULT_CORS_ALLOWED_ORIGINS="http://localhost:5173"
```

## Dosya Yapısı

```
.
├── .env.example        # Webhook adresi için örnek çevre değişkeni
├── index.html          # Vite giriş noktası
├── package.json        # Proje bağımlılıkları ve komutları
├── src/
│   ├── App.jsx         # Ana uygulama
│   ├── components/     # ChatWindow, ChatBubble, MessageInput bileşenleri
│   ├── hooks/          # useChat özel hook'u
│   ├── services/       # n8n webhook'una istek atan yardımcı fonksiyon
│   └── styles.css      # Arayüz stilleri
└── vite.config.js      # Vite yapılandırması
```

## Özelleştirme Önerileri

- `src/styles.css` dosyasındaki renkler ve tipografiyle oynamak tasarımı markanıza uyarlamanızı sağlar.
- `useChat` hook'u içerisindeki başlangıç mesajını değiştirerek ziyaretçilere özel karşılamalar sunabilirsiniz.
- Eğer n8n akışınız farklı bir yanıt yapısı döndürüyorsa `src/services/chatService.js` dosyasını ihtiyaçlarınıza göre düzenleyin.

## Değişiklikleri Git'e Göndermek

Projenin kendi ortamınızda çalıştığından emin olduktan sonra dosyaları bir uzak depoya göndermek için aşağıdaki adımları izleyebilirsiniz:

1. Eğer henüz eklemediyseniz uzak depo adresini tanımlayın:

   ```bash
   git remote add origin https://github.com/<kullanici-adi>/<depo-adi>.git
   ```

2. Tüm değişiklikleri commit'leyin:

   ```bash
   git add .
   git commit -m "n8n chatbot arayüzü ekle"
   ```

3. Commit'i uzak depoya gönderin:

   ```bash
   git push -u origin work
   ```

Farklı bir dal adı kullanıyorsanız `work` yerine kendi dal adınızı yazmayı unutmayın.

## Lisans

Bu proje eğitim amaçlı örnek bir uygulamadır; dilediğiniz gibi kopyalayıp özelleştirebilirsiniz.
