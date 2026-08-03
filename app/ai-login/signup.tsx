<!-- Import necessary components and styles here -->
import { Form, Input, Button } from '@nextui-org/react';

export default function Signup() {
  return (
    <Form>
      <Input
        type='text'
        placeholder='Username'
        name='username'
      />
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
      <Button type='submit'>Signup</Button>
    </Form>
  );
};