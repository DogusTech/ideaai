// Import required components
import Link from 'next/link'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

// Define the register component
export default function Register() {
    return (
        <div className='flex flex-col items-center justify-center h-screen p-4'>
            <h1 className='text-3xl font-bold mb-4'>Register</h1>
            <form className='w-full max-w-md p-4 bg-white rounded-lg shadow-md'>
                <div className='flex flex-col mb-4'>
                    <label className='text-lg font-bold'>Email:</label>
                    <input type='email' className='w-full p-2 mb-2 border border-gray-400 rounded-lg' placeholder='john.doe@example.com' />
                </div>
                <div className='flex flex-col mb-4'>
                    <label className='text-lg font-bold'>Password:</label>
                    <input type='password' className='w-full p-2 mb-2 border border-gray-400 rounded-lg' placeholder='Password' />
                    <button type='button' className='flex items-center justify-center w-full p-2 mb-2 bg-gray-200 rounded-lg hover:bg-gray-300'><AiOutlineEyeInvisible className='mr-2' />Show</button>
                </div>
                <button type='submit' className='w-full p-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg'>Register</button>
            </form>
        </div>
    )
}