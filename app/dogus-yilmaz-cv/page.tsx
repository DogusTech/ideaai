import React from "react";
import { Mail, Github, Linkedin, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CVPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="bg-slate-900 text-white px-8 py-10 md:px-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Doğuş Yılmaz</h1>
            <h2 className="text-xl md:text-2xl font-medium text-emerald-400">Mid-Level Full-Stack Developer</h2>
          </div>
          <div className="flex flex-col space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>info@aeternexus.com</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Github className="w-4 h-4 text-emerald-400" />
              <Link href="https://github.com/DogusTech" target="_blank" className="hover:text-white transition-colors">
                github.com/DogusTech
              </Link>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Linkedin className="w-4 h-4 text-emerald-400" />
              <Link href="https://linkedin.com/company/togetlink" target="_blank" className="hover:text-white transition-colors">
                LinkedIn Profilim
              </Link>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>İstanbul, Türkiye</span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          
          {/* HAKKIMDA (SUMMARY) */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">
              Hakkımda
            </h3>
            <p className="text-gray-600 leading-relaxed text-justify">
              Kendi teknoloji şirketini (Aeternexus A.Ş.) kurmuş, TogetLink adlı "Phygital Networking" platformunu sıfırdan geliştirmiş ve canlıya almış, hem yazılım mimarisini hem de ürün vizyonunu yönetmiş bir <strong>Mid-Level Full-Stack Developer</strong>'ım. 
              Modern web teknolojileri (React, Next.js, Firebase) ile ölçeklenebilir, gerçek zamanlı (real-time) ve kullanıcı odaklı sistemler tasarlama konusunda derin pratik tecrübeye sahibim. Sadece kendisine verilen görevi kodlayan değil; ürün geliştiren (Product-Minded), pazarlama, SEO ve kullanıcı deneyimini (UX) göz önünde bulunduran, inisiyatif alabilen bir mühendis olarak dahil olacağım ekibe doğrudan değer katmaya hazırım.
            </p>
          </section>

          {/* DENEYİM (EXPERIENCE) */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">
              İş Deneyimi
            </h3>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Kurucu & Lead Full-Stack Developer</h4>
                  <div className="text-emerald-600 font-medium">Aeternexus Inc. (TogetLink)</div>
                </div>
                <div className="text-sm text-gray-500 font-semibold bg-white px-3 py-1 rounded-full border border-gray-200">
                  2024 – 2026
                </div>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-600">
                <li>TogetLink uygulamasının tüm yazılım mimarisini, veritabanı tasarımını ve kullanıcı arayüzünü (Next.js, Tailwind CSS, Firebase) baştan sona tek başıma geliştirdim.</li>
                <li>Fiziksel mekanlarda (kafe, ofis) çalışan profesyonelleri eşleştiren <strong>gerçek zamanlı (real-time)</strong> lokasyon tabanlı veri işleme ve anlık mesajlaşma altyapısını kurdum.</li>
                <li>Uygulamayı uluslararası ölçekte Vercel üzerinde canlıya aldım (CI/CD) ve kısa sürede 100'den fazla aktif kullanıcıya ulaştırdım.</li>
                <li>Sadece teknik tarafı değil; ürünün global SEO stratejilerini (Medium, Hashnode), fonlama kampanyalarını ve şirket içi yasal/operasyonel süreçleri bizzat yönettim.</li>
              </ul>
            </div>
          </section>

          {/* YETKİNLİKLER (SKILLS) */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">
              Teknik Yetkinlikler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <h4 className="font-semibold text-slate-700 mb-3">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {["React.js", "Next.js", "Tailwind CSS", "TypeScript", "JavaScript (ES6+)", "UI/UX Design", "Responsive Tasarım"].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 mb-3">Backend & Cloud</h4>
                <div className="flex flex-wrap gap-2">
                  {["Node.js", "Firebase", "Firestore (NoSQL)", "Firebase Auth", "Real-time DB", "Vercel", "RESTful API"].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-semibold text-slate-700 mb-3">Araçlar & Diğer Beceriler</h4>
                <div className="flex flex-wrap gap-2">
                  {["Git / GitHub", "Product Management", "SEO", "Kitle Fonlaması Yönetimi", "Problem Çözme", "Girişimcilik", "Agile"].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* EĞİTİM (EDUCATION) */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800 border-b-2 border-emerald-500 pb-2 inline-block">
              Eğitim
            </h3>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Mehmet Ali Büyükhanlı Mesleki ve Teknik Anadolu Lisesi</h4>
                <div className="text-gray-600">Bilişim Teknolojileri</div>
              </div>
              <div className="mt-2 md:mt-0 text-sm text-gray-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                2020 – 2024
              </div>
            </div>
          </section>

        </div>
      </div>
      
      {/* PRINT INSTRUCTION (Visible only on screen, hidden when printed) */}
      <div className="max-w-4xl mx-auto mt-6 text-center text-gray-500 text-sm print:hidden">
        İpucu: Bu CV'yi PDF olarak indirmek için <strong>Ctrl + P</strong> (Mac için Cmd + P) tuşlarına basın ve <strong>"PDF Olarak Kaydet"</strong> seçeneğini kullanın.
      </div>
    </div>
  );
}
