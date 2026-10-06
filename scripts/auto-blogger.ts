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
    const prompt = `Write a comprehensive, SEO-optimized, highly engaging blog post in purely English about "${selectedKeyword}".
Focus on how AI coding agents (especially our powerful tool, IdeaAI) help developers automate tasks and build software faster.

CRITICAL REQUIREMENTS FOR THE OUTPUT:
1. The entire article must be in English.
2. You MUST include a Markdown Table comparing IdeaAI with a competitor (e.g., GitHub Copilot, Cursor, or Devin).
3. You MUST mention at least one competitor's landing page URL (e.g., cursor.com, github.com/features/copilot).
4. You MUST include a relevant YouTube video link of a competitor or coding agent demo (use this exact Markdown format: [Watch the competitor demo on YouTube](https://www.youtube.com/watch?v=dQw4w9WgXcQ) but you can use a real coding agent video ID if you know one, otherwise use a placeholder).
5. Use markdown formatting, H2/H3 headings, and bullet points. Write like an expert tech blogger.
6. Do NOT include any intro like "Here is the blog". Start immediately with the blog content.`;

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
