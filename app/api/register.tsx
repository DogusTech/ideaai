<!-- Import necessary components from @/components/ui -->
import { Button, Input, Card } from '@/components/ui';

<!-- Define the Register component -->
const Register = () => {
  return (
    <Card>
      <h1>Register</h1>
      <Input placeholder='Username' />
      <Input placeholder='Password' />
      <Button>Submit</Button>
    </Card>
  );
};

export default Register;