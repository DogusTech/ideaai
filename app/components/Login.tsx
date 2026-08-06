<!-- Import necessary components -->
import { Button } from '@/components/ui/Button';

<!-- Define the Login component -->
function Login() {
  return (
    <div className='max-w-md mx-auto p-8 bg-white/10 backdrop-blur rounded-lg shadow-md'>
      <h2 className='text-3xl font-bold mb-4'>Login</h2>
      <form className='space-y-6'>
        <div className='relative z-0 mb-4 group'>
          <input
            type='email'
            name='email'
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg focus:ring-0 focus:border-blue-600' placeholder='Email address' required
          />
        </div>
        <div className='relative z-0 mb-4 group'>
          <input
            type='password'
            name='password'
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg focus:ring-0 focus:border-blue-600' placeholder='Password' required
          />
        </div>
        <Button type='submit'>Login</Button>
      </form>
    </div>
  );
}

export default Login;
