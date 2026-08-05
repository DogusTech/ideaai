import { AiRouter } from 'next/dist/client/router';

export const getAiRouter = async () => {
  return {
    ai: {
      render: () => (
        <div className="flex justify-center items-center h-screen bg-white/10 backdrop-blur-sm">
          <h1>AI Dashboard</h1>
        </div>
      ),
    },
  };
};