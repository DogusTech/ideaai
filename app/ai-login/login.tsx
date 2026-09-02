<!-- Import necessary components and styles here -->
import { Form, Input, Button } from '@nextui-org/react';

export default function Login() {
  return (
    <Form>
      <Input
        type='email'
        placeholder='Email'
        name='email'
      />
      <Input
        type='password'
        placeholder='Password'
        name='password'
      />
      <Button type='submit'>Login</Button>
    </Form>
  );
};
