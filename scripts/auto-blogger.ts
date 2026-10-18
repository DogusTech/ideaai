import fs from 'fs';
import path from 'path';

// Kelimelerin olduğu dosyanın yolu
const keywordsPath = path.join(__dirname, '../keywords.txt');

async function run() {
  console.log("=== IdeaAI Otonom SEO Ajanı Başlıyor ===");

  if (!fs.existsSync(keywordsPath)) {
    console.error("[-] HATA: keywords.txt bulunamadı!");
    return;
  }

  const keywords = fs.readFileSync(keywordsPath, 'utf-8').split('\n').filter(k => k.trim() !== '');

  if (keywords.length === 0) {
    console.log("[!] Tüm kelimeler bitmiş. Yeni kelimeler ekleyin.");
    process.exit(0);
  }

  // Listeden rastgele bir kelime seç
  const randomIndex = Math.floor(Math.random() * keywords.length);
  const selectedKeyword = keywords[randomIndex].replace(/\r/g, '').trim();

  // Kelimeyi listeden çıkar ve dosyayı güncelle
  keywords.splice(randomIndex, 1);
  fs.writeFileSync(keywordsPath, keywords.join('\n'), 'utf-8');

  console.log(`[+] Seçilen Kelime: "${selectedKeyword}"`);
  console.log(`[+] Kalan Kelime Sayısı: ${keywords.length}`);

  try {
    // 1. OLLAMA İLE MAKALE YAZDIR (ui-llama)
    console.log(`[+] ui-llama'ya makale yazdırılıyor... (Lütfen bekleyin, bilgisayarınızın hızına göre sürebilir)`);
    const prompt = `You are a Senior DevOps Engineer and Technical Content Strategist (Developer Advocate). 
Your task is to write a highly technical, deep-dive blog post for software engineers and sysadmins about "${selectedKeyword}". 
You must completely avoid empty marketing jargon and focus directly on problems, solutions, and technical depth.

STRICT RULES AND ANTI-PATTERNS:
1. BANNED CLICHÉS: Never start or end with generic phrases like "In today's fast-paced digital world...", "The world of software development is rapidly evolving...", "game-changer", "revolutionizing the industry", or "stay ahead of the curve". 
2. NO ABSTRACT PROMISES: Do not just say "automates everything" or "optimizes performance". If you claim something, immediately explain the TECHNICAL MECHANISM (which command, which config file, which protocol, e.g., systemd, Nginx, Docker, AST parsing).
3. HONEST COMPARISON: Do not unfairly compare IdeaAI to Cursor or Copilot. Acknowledge that Cursor/Copilot are excellent IDE code-completion assistants. IdeaAI's difference is that it acts autonomously at the terminal/OS/workspace level, creating folders, running commands, and managing deployments directly on the local file system.

CONTENT ARCHITECTURE (Follow this structure):
1. A Real, Painful Problem: Start with a specific, painful terminal/deployment/coding problem related to the keyword (e.g., SSH drops, tricky Nginx reverse proxy SSL conflicts, environment variable mess).
2. Traditional vs. Agent Approach: Briefly explain why doing this manually takes 45 minutes and is prone to human error.
3. The IdeaAI Solution (Concrete Code/Terminal Block): Show exactly how IdeaAI is triggered in the terminal, which bash/powershell commands it executes automatically, and provide a concrete Markdown code block of the output or config it generates.
4. Honest Comparison Table: Provide an objective Markdown table comparing IdeaAI (Terminal/OS autonomous execution) vs. standard IDE assistants (IDE code completion).
5. Must include a YouTube video link formatted as: [Watch the Cursor Demo](https://youtu.be/UxbULt_hCdA?si=UmN6h_OvJuAymTvu) (or any relevant technical video).
6. Must include a competitor URL (e.g., cursor.com, github.com).

TONE:
- Write purely in English.
- Developer-to-developer, pragmatic, direct, no marketing fluff.
- Use H2/H3 headings, bullet points, and code blocks. 
- Do NOT output any conversational intro like "Here is the blog". Start directly with the content.`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'ui-llama',
        prompt: prompt,
        stream: false
      })
    });
    
    if (!response.ok) {
        throw new Error("Ollama API yanıt vermedi. Ollama çalışıyor mu?");
    }

    const data = await response.json();
    const articleContent = data.response;
    console.log(`[+] Makale yazımı tamamlandı! (${articleContent.length} karakter)`);

    // 2. GÖRSEL ÜRET (Pollinations.ai - Ücretsiz ve Limitsiz)
    const imagePrompt = `A hyper-realistic, highly detailed, cinematic 3D render of a futuristic AI robot coding on a sleek modern laptop. Subject: ${selectedKeyword}. The robot should look elegant and advanced. The background should be a clean, modern software development office with soft blue and neon lighting. Very high quality, 8k resolution, Unreal Engine 5 style.`;
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const coverImage = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&model=flux`;
    console.log(`[+] Otomatik kapak görseli oluşturuldu.`);

    // 3. SEO DOSTU URL (Slug) OLUŞTUR
    const slug = selectedKeyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const title = selectedKeyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // 4. DOSYAYA KAYDET (Firebase henüz kurulu olmadığı için yerel .md dosyası olarak kaydedelim)
    const articlesDir = path.join(__dirname, '../content/articles');
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }

    const fileContent = `---
title: "${title}"
slug: "${slug}"
coverImage: "${coverImage}"
publishedAt: "${new Date().toISOString()}"
---

${articleContent}
`;

    fs.writeFileSync(path.join(articlesDir, `${slug}.md`), fileContent, 'utf-8');
    
    console.log(`[+] BAŞARILI! Makale klasöre kaydedildi.`);
    console.log(`[+] Görsel Linki: ${coverImage}`);
    console.log(`[+] Dosya: content/articles/${slug}.md`);

  } catch (error) {
    console.error("[-] Bir hata oluştu:", error);
    // Hata durumunda kelimeyi kaybetmemek için geri ekleyebiliriz
    fs.appendFileSync(keywordsPath, '\\n' + selectedKeyword);
  }
}

run();
