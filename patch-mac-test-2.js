const fs = require('fs');

function patchMacTest() {
  const filePath = 'components/ai/idea-ai-interface-mac.tsx';
  let code = fs.readFileSync(filePath, 'utf8');

  // Fix 1: The catch block
  const oldCatchRegex = /\} catch \(err: any\) \{\s*if \(err\.name !== 'AbortError'\) \{\s*setError\(err\);\s*setStatus\('error'\);\s*\} else \{\s*setStatus\('ready'\);\s*\}\s*\}/;
  
  const newCatch = `} catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMsg = { id: Date.now().toString(), role: 'assistant', content: \`**[System Error]**\\n\` + (err.message || "An unknown error occurred.") };
        setMessages(prev => [...prev, errorMsg]);
        setStatus('ready');
      } else {
        setStatus('ready');
      }
    }`;
  
  if (oldCatchRegex.test(code)) {
    code = code.replace(oldCatchRegex, newCatch);
    console.log("Successfully replaced catch block!");
  } else {
    console.log("Could not find the catch block to replace. It might already be replaced, or regex failed.");
  }

  // Fix 2: Remove avatar icons
  // It looks like:
  // <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[13px] font-semibold ${
  //   message.role === 'user' ? 'bg-black text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md'
  // }`}>
  //   {message.role === 'user' ? (userEmail ? userEmail[0].toUpperCase() : 'U') : 'AI'}
  // </div>
  const avatarRegex = /<div className=\{`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-\[13px\] font-semibold \$\{\s*message\.role === 'user' \? 'bg-black text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md'\s*\}`\}>\s*\{message\.role === 'user' \? \(userName \|\| 'User'\) : 'AI'\}\s*<\/div>/g;
  
  // Wait, my previous patch changed `userEmail` to `userName`. Let me use a more generic regex.
  const avatarRegexGeneric = /<div className=\{`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-\[13px\] font-semibold[\s\S]*?<\/div>/g;
  
  // Since there are two matches (one for user/ai avatars, one in the loading block), I will replace them all with nothing!
  code = code.replace(avatarRegexGeneric, "");
  console.log("Removed avatar icons");

  // Fix 3: Update Message Card Borders
  // Find the message card div:
  // <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
  //   message.role === 'user' 
  //     ? 'bg-black/5 border border-black/5 text-black' 
  //     : 'bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-black/5'
  // }`}>
  
  const messageCardRegex = /<div className=\{`max-w-\[85%\] rounded-2xl px-5 py-4 \$\{\s*message\.role === 'user'\s*\? 'bg-black\/5 border border-black\/5 text-black'\s*: 'bg-white shadow-\[0_2px_15px_rgba\(0,0,0,0\.03\)\] border border-black\/5'\s*\}`\}>/g;
  
  const newMessageCard = `<div className={\`max-w-[85%] rounded-[20px] px-5 py-4 \${
                          message.role === 'user' 
                            ? 'bg-[#F9FAFB] border border-[#E5E7EB] text-black' 
                            : 'bg-white shadow-sm border border-[#E5E7EB] text-black'
                        }\`}>`;
                        
  code = code.replace(messageCardRegex, newMessageCard);
  
  // Also fix the loading block message card styling (make it transparent, no border)
  const loadingBlockRegex = /<div className="bg-white shadow-\[0_2px_15px_rgba\(0,0,0,0\.03\)\] border border-black\/5 rounded-2xl px-6 py-4 flex items-center justify-center">/g;
  const newLoadingBlock = `<div className="flex items-center justify-center py-2 px-2">`;
  code = code.replace(loadingBlockRegex, newLoadingBlock);

  fs.writeFileSync(filePath, code);
  console.log("Patch complete.");
}

patchMacTest();
