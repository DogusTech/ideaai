const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

const loadingBlock = `
                    {status === 'submitted' && (
                      <div className="flex gap-4 flex-row opacity-80 transition-opacity">
                        <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
                          AI
                        </div>
                        <div className="bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-black/5 rounded-2xl px-6 py-4 flex items-center justify-center">
                          <img 
                            src="/ideaai-logo.png" 
                            alt="Thinking..." 
                            className="w-5 h-5 ideaai-thinking-anim" 
                          />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />`;

code = code.replace(/<div ref=\{messagesEndRef\} \/>/, loadingBlock);

fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
console.log("Injected loading indicator");
