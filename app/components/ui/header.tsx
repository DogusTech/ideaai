import { CorporateBackground } from './corporate-background';

export const Header = () => {
  return <header className="bg-white/10 backdrop-blur p-4 text-lg font-bold">
    <CorporateBackground />
    <nav className="flex justify-between items-center">
      <a href="/ai" className="text-blue-500 hover:text-blue-700">AI Landing Page</a>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
    </nav>
  </header>;
};