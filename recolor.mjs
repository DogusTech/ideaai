import fs from 'fs';

let content = fs.readFileSync('app/ai-landing-page/page.tsx', 'utf8');

// Global color replacements
content = content.replace(/bg-white/g, 'bg-[#1a1a1a]');
content = content.replace(/text-zinc-900/g, 'text-white');
content = content.replace(/text-zinc-500/g, 'text-zinc-400');
content = content.replace(/border-zinc-100/g, 'border-zinc-800');
content = content.replace(/border-zinc-200/g, 'border-zinc-700');
content = content.replace(/bg-zinc-50/g, 'bg-[#222]');

// Main CTA Replacement
// From bg-zinc-900 hover:bg-zinc-800 to bg-[#3e6ae1] hover:bg-blue-600
content = content.replace(/bg-zinc-900 hover:bg-zinc-800/g, 'bg-[#3e6ae1] hover:bg-blue-600');

// Secondary CTA Replacement
// It is currently: bg-[#1a1a1a] hover:bg-[#222] text-white border border-zinc-700 (after global replace)
// He wants bg-[#2c2e2d] hover:bg-[#3d3f3e]
content = content.replace(/className="w-full sm:w-auto bg-\[\#1a1a1a\] hover:bg-\[\#222\] text-white border border-zinc-700/g, 'className="w-full sm:w-auto bg-[#2c2e2d] hover:bg-[#3d3f3e] text-white border border-zinc-700');

// Voice AI Sparkle Badge
const voiceBadge = `
            {/* Voice Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-zinc-800/80 backdrop-blur-md rounded-full pl-2 pr-3 py-1.5 mr-2 border border-zinc-700/50 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-zinc-300">Voice</span>
            </div>
`;

// Insert voice badge before the Microsoft button
content = content.replace(
  /<a href="https:\/\/apps\.microsoft\.com\/store\/detail\/9P9SFWQGBSK7"/g,
  voiceBadge + '\n            <a href="https://apps.microsoft.com/store/detail/9P9SFWQGBSK7"'
);

// Video Demo Placeholder
const videoDemo = `
      {/* Video Demo Section */}
      <section className="px-6 pb-32 relative z-10 -mt-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-[#0f0f0f]">
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group hover:bg-black/20 transition-all cursor-pointer z-10">
              <div className="w-20 h-20 rounded-full bg-[#3e6ae1]/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>
            {/* Placeholder Image / Grid */}
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-sm">
              [ Product Demo Video ]
            </div>
          </div>
        </div>
      </section>
`;

content = content.replace(
  /\{\/\* Video Placeholder Section \*\/\}\s*<section className="px-6 pb-32 relative z-10">\s*<div className="max-w-6xl mx-auto">[\s\S]*?<\/section>/,
  videoDemo
);

// Lucide React Play icon import
if (!content.includes('import { Play }')) {
  content = content.replace(/import { VoiceAIButton }/, "import { Play } from 'lucide-react';\nimport { VoiceAIButton }");
}

fs.writeFileSync('app/ai-landing-page/page.tsx', content);
console.log("Transformation complete.");
