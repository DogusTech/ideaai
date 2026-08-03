// Import necessary components
import Link from 'next/link'

// Define the Login component
export default function Login() {
    return (
        <div className='flex justify-center items-center h-screen'>
            <Link href='/login'><a className='text-blue-500 hover:text-blue-700'>Login</a></Link>
        </div>
    )
}