export default function AboutPage() {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:px-8 xl:px-12 2xl:px-16 mb-8">
      <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-4">
        Hakkımızda
      </h1>

      <div className="text-lg leading-relaxed text-gray-500">
        Google, teknoloji ve internet hizmetleri sunan bir Amerikan multimedya şirketidir. Dünyayı daha erişilebilir kılmak için çalışıyoruz.
      </div>

      <img src="https://source.unsplash.com/800x600/?corporate,office,technology" className="w-full h-auto mb-8" />
    </div>
  );
}