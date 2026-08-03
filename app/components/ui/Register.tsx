// Import necessary components
import Link from 'next/link'

// Define the Register component
export default function Register() {
    return (
        <div className='flex justify-center items-center h-screen'>
            <Link href='/register'><a className='text-blue-500 hover:text-blue-700'>Register</a></Link>
        </div>
    )
}