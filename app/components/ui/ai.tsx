import { Ai } from '@/components/ui/Ai';

const Ai = () => {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4">AI</h1>
      <p className="text-lg font-medium mb-4">Welcome to the AI landing page!</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Learn More
      </button>
    </div>
  );
};

export default Ai;