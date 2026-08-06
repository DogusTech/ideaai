<!-- Import necessary components -->
import { Button, Input } from '@/components/ui';

<!-- AI Page -->
export default function AiPage() {
  return (
    <div>
      <h1>AI Page</h1>
      <Input type='text' placeholder='Username' />
      <Input type='password' placeholder='Password' />
      <Button>Submit</Button>
    </div>
  );
}