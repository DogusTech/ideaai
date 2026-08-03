<!-- Import necessary components -->
import { Button, Input } from '@/components/ui';

<!-- Login Page -->
export default function LoginPage() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='bg-white/10 backdrop-blur p-10 rounded-md shadow-md'>
        <h1 className='text-3xl font-bold mb-5'>Login</h1>
        <Input placeholder='Email' />
        <Input placeholder='Password' />
        <Button>Submit</Button>
      </div>
    </div>
  );
}