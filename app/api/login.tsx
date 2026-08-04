<!-- Import necessary components from @/components/ui -->
import { Button, Input, Card } from '@/components/ui';

<!-- Define the Login component -->
const Login = () => {
  return (
    <Card>
      <h1>Login</h1>
      <Input placeholder='Username' />
      <Input placeholder='Password' />
      <Button>Submit</Button>
    </Card>
  );
};

export default Login;