const fs = require('fs');
let code = fs.readFileSync('components/ai/idea-ai-interface-mac.tsx', 'utf8');

const replacement = `<AntigravityMarkdown content={message.content} />
                          {message.options && message.options.length > 0 && (
                            <div className="mt-4 flex flex-col gap-2">
                              <div className="text-[11px] font-semibold text-black/40 uppercase tracking-wider mb-1">Deterministic Options</div>
                              {message.options.map((opt, idx) => (
                                <button 
                                  key={idx}
                                  onClick={() => {
                                    setLocalInput(opt);
                                    // Trigger send logic
                                    setTimeout(() => handleCustomSubmit(), 50);
                                  }}
                                  className="text-left px-4 py-2.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-[13px] text-indigo-700 font-medium transition-colors"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>`;

code = code.replace(/<AntigravityMarkdown content=\{message\.content\} \/>\s+<\/div>/, replacement);

fs.writeFileSync('components/ai/idea-ai-interface-mac.tsx', code);
console.log('Done chat options');
