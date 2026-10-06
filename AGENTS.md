# IdeaAI Master Context & Developer Guidelines

This file contains the persistent context and guidelines for the IdeaAI project, the founder (Doğuş Yılmaz), the product vision, and the architecture. AI agents must follow this context strictly when working in this workspace.

## 1. Kullanıcı Profili ve Çalışma Biçimi
- **Kullanıcı:** Doğuş Yılmaz (Solo Technical Founder & CEO).
- **Teknik Stack:** Next.js, React, TypeScript, Tailwind, Firebase, Node.js, Electron, AI/LLM entegrasyonları.
- **Tasarım Zevki:** Minimalist, premium, "Elite SaaS", Apple/macOS/Cursor/Antigravity hissi. Gereksiz UI öğelerinden kaçın. Güçlü whitespace, ince borderlar, iyi tipografi (Google Sans Flex).
- **Çalışma Şekli:** Doğrudan, pratik ve sonuç odaklı cevaplar ver. Ürünün profesyonel ve yatırımcıya gösterilebilir düzeyde olmasını sağla. Sadece kod değil; terminal, GitHub, CI/CD ve dosya sistemi seviyesinde "gerçek execution" yapabilen bir ajan vizyonuna uygun kod yaz.

## 2. Ana Proje: IdeaAI (eski adıyla TogetLink)
IdeaAI, basit bir chatbot değil; masaüstünde çalışan, dosya ve terminal yetenekleri olan, bilgisayar kapalıyken bile bulut tarafında işine devam edebilen **Otonom bir AI Coding Agent / Autonomous Engineering Workspace** ürünüdür. Ürün konumlandırması sıradan bir web uygulamasından "gerçek bir masaüstü mühendisine" evrilmiştir.

## 3. Hibrit Mimari (Hybrid Engine)
- **Local (Gündüz):** Electron, local filesystem, local commands, Ollama, hızlı/mahrem işlemler. Kullanıcı ile serbest (probabilistic) planlama ve kodlama yapar.
- **Cloud (Gece):** Modal/Azure, cloud LLM, GitHub, Railway, CI/CD, webhook'lar. Deterministic execution; kullanıcı uyurken bile GitHub üzerinden uzun soluklu işleri sürdürür.
- **Vurgu:** "Claude Code mesaide size eşlik eder; IdeaAI siz uyurken mesaiye kalır."

## 4. Kimlik, Satış ve Yatırımcı Dili
- Şirket bir Delaware company'dir. Hedef kitlesi: Enterprise IT, AI, Developer Tools.
- Başvurularda ve Outreach mesajlarında gerçek bilgiler kullanılmalı; ancak ürün çok güçlü bir **"Autonomous AI Agent & Enterprise Developer Tool"** olarak konumlandırılmalı.
- **ÖNEMLİ:** Yatırımcılara "0.000001% hallucination" gibi kanıtlanmamış aşırı metrikler sunma. Dürüst, teknik, doğrudan ve etkileyici bir "Solo Technical Founder" dili kullan.

## 5. Uygulama İçi Sistemler
- **Auth:** Firebase Auth, Firebase Admin, Email OTP (Resend ile), HttpOnly Custom Token Cookie, korumalı `/ai` route'u.
- **AI Modelleri:** Modal üzerinden fine-tuned Llama 3 (ve gelecekte Ollama). 
- **Veritabanı:** Firestore.
- **Arayüz (UI):** Özel Antigravity/Cursor benzeri UI (thought blokları, terminal komutları, dosya değişiklikleri `<think>`, `[MODIFY]` formatlarında parse edilerek şık görünür). Kesinlikle ham markdown gösterilmez.

## 6. Frontend Geliştirme Standartları
- Varolan iyi UI'ı sırf yenilik olsun diye bozma. "Nothing left to remove" prensibiyle ilerle.
- `/app` ve `/mac-test` ayrımına saygı duy.
- Tailwind V4 kullan. Lucide ikonları yerine inline SVG tercih edilebilir.
- Animasyonlar (GSAP vb.) akıcı ama performanslı olmalıdır.
- Routing sorunları, middleware'deki async cookie işlemleri (Next.js 15+ API'leri) ve build hatalarında Firebase Auth context'ini göz önünde bulundur.

## 7. Davranış İlkeleri
- Pazarlama metinleri yazarken klişelerden ("revolutionizing", "fast-paced world") tamamen kaçın; teknik derinlik (hangi bash komutu, Nginx, CI/CD kurgusu vb.) sun.
- IdeaAI'ın Microsoft Store, Product Hunt, AppSumo, Reddit yayın durumlarını ve Modal endpoint durumunu körü körüne aktif varsayma; gerekirse kontrol et veya kullanıcıya sor.
- Sürekli "Bu ürün çalışıyor mu?" diyen yatırımcı dilinden ziyade, teknik doğrulanabilir mimari sun (Örn: Webhook-driven Sentry/GitHub entegrasyonları).

> Bu dosya, IdeaAI kod tabanının kalbidir. Sistemin vizyonu, tasarım standartları ve ürünün ruhu bu kurallara dayanmaktadır. Kodlarken, içerik üretirken ve plan yaparken daima bu kuralları hatırla.
