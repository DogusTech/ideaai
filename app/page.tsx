<!-- Import necessary components from @/components/ui -->
import { Button, Input } from '@/components/ui';

// Define the Register page component
export default function Register() {
  return (
    <div className='flex justify-center items-center h-screen bg-white/10 backdrop-blur-sm'>
      <div className='max-w-md p-8 bg-white shadow-md rounded-md'>
        <h2 className='text-lg font-bold mb-4'>Register</h2>
        <form className='space-y-4'>
          <div className='space-y-1'>
            <Input placeholder='Email' type='email' />
            <Input placeholder='Password' type='password' />
          </div>
          <Button type='submit'>Register</Button>
        </form>
      </div>
    </div>
  );
}