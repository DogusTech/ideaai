const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

const triggerCode = `if (userInput.startsWith('/test-hybrid')) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userInput }]);
        setStatus('submitted');
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            role: 'assistant', 
            content: 'Gece protokolü başarıyla aktif edildi. Hibrit sistem Modal Cloud üzerinden çalışıyor. Hedef: "Sistemdeki kimlik doğrulama hatalarını gider."\\n\\nLütfen nasıl ilerleyeceğimi deterministik olarak seçin:',
            options: [
              "1. Sadece Auth.tsx dosyasını analiz et",
              "2. Tüm projedeki Firebase bağlantılarını kontrol et",
              "3. Gece modunu iptal et ve local IPC'ye dön"
            ]
          }]);
          setStatus('ready');
        }, 1000);
        return;
      }
      
      // -- LOCAL AGENT BRIDGE INTERCEPTION --`;

code = code.replace('// -- LOCAL AGENT BRIDGE INTERCEPTION --', triggerCode);

fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
console.log('Added fake test command');
