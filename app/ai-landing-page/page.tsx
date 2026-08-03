import Header from './components/Header';
import Footer from './components/Footer';

export default function AiLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Welcome to TogetLink AI!
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl">
          This is a platform featuring an AI landing page, a dashboard, user login/signup, and GitHub integration. 
          The AI is currently building this section block by block!
        </p>
      </main>
      <Footer />
    </div>
  );
}