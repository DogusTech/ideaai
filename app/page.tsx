<!-- Import UI components from @/components/ui -->
import { Button, Input, Text } from '@/components/ui';

export default function Login() {
  return (
    <div>
      <Text>Login Page</Text>
      <Input placeholder='username' />
      <Input placeholder='password' />
      <Button>Login</Button>
    </div>
  );
}