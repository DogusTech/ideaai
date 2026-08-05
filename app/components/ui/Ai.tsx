import { FC } from 'react';
import { AiOutlineDashboard } from 'react-icons/ai';

interface Props {}

const Ai: FC<Props> = () => {
  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-md">
      <h2 className="text-lg text-gray-600 font-bold mb-4">AI Dashboard</h2>
      <div className="space-y-4">
        <button className="py-2 px-4 rounded-lg bg-blue-500 text-lg text-white hover:bg-blue-700" type="button">Start AI</button>
        <button className="py-2 px-4 rounded-lg bg-blue-500 text-lg text-white hover:bg-blue-700" type="button">Stop AI</button>
      </div>
    </div>
  );
};

export default Ai;