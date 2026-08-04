import { Ai } from '../components/ui/Ai';
import { AiRouter } from '../components/ui/AiRouter';

export default function AiPage() {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:px-8">
      <AiRouter />
      <Ai />
    </div>
  );
}