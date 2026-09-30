with open("components/ai/idea-ai-interface-mac.tsx", "r", encoding="utf-8") as f:
    code = f.read()

search = """        } else {
          clearInterval(interval);
          setStatus('ready');
        }"""

replacement = """        } else {
          clearInterval(interval);
          setStatus('ready');

          // --- AUTONOMOUS AGENT PARSER ---
          try {
            const writeRegex = /<write_file\\s+path=["\\']([^"\\']+)["\\']>([\\s\\S]*?)<\\/write_file>/g;
            let match;
            let filesWritten = [];
            while ((match = writeRegex.exec(fullText)) !== null) {
               const filePath = match[1];
               const fileContent = match[2].trim();
               AgentBridge.writeFile(filePath, fileContent).then(res => {
                  if (res.success) {
                     console.log("File written:", filePath);
                  }
               });
               filesWritten.push(filePath);
            }
            if (filesWritten.length > 0) {
               setTimeout(() => {
                 setMessages(prev => [...prev, {
                    id: Date.now().toString() + "-sys",
                    role: 'assistant',
                    content: '**[Otonom Islem Basarili]**\\nSu dosyalar bilgisayariniza kaydedildi:\\n' + filesWritten.map(f => '- `' + f + '`').join('\\n')
                 }]);
               }, 500);
            }
          } catch (e) {
            console.error("Agent Parser Error:", e);
          }
          // -------------------------------
        }"""

import re
code = re.sub(r"        \} else \{\s*clearInterval\(interval\);\s*setStatus\('ready'\);\s*\}", replacement.replace('\\', '\\\\'), code)
with open("components/ai/idea-ai-interface-mac.tsx", "w", encoding="utf-8") as f:
    f.write(code)
