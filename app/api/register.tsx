<!-- Import necessary components -->
import { Button, Input } from '@/components/ui';

<!-- Register Page -->
export default function RegisterPage() {
  return (
    <div>
      <h1>Register Page</h1>
      <Input type='text' placeholder='Username' />
      <Input type='password' placeholder='Password' />
      <Button>Submit</Button>
    </div>
  );
}