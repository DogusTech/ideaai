// Import necessary components from the UI library
import { Button, Container, Heading, Text } from '@/components/ui';

// Import necessary hooks from React
import { useState, useEffect } from 'react';

// Import necessary utilities from Tailwind
import { usePathname, useRouter } from 'next/navigation';

// Import necessary types from TypeScript
import type { NextPage } from 'next';

// Define the LandingPage component
const LandingPage: NextPage = () => {
  // Use the useRouter hook to get the current pathname
  const { pathname } = useRouter();

  // Use the useState hook to store the user's input
  const [username, setUsername] = useState('');

  // Use the useEffect hook to handle form submission
  useEffect(() => {
    // Submit the form when the user clicks the button
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Call the API endpoint to register the user
      const response = await fetch('/api/ai-landing-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      // Handle the response from the API endpoint
      const data = await response.json();

      // Display a success message to the user
      alert(`Hello, ${username}! You have been successfully registered.`);
    };

    // Add an event listener to the form to handle submission
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
  }, [username]);

  // Render the login form
  return (
    <Container className='max-w-md mx-auto p-4 mt-12 mb-12 bg-white/10 backdrop-blur rounded-md shadow-md'>
      <Heading as='h1' size='xl' className='text-center mb-4'>Welcome to the AI Landing Page!</Heading>
      <form id='login-form' onSubmit={handleSubmit}>
        <Text as='label' className='block mb-2'>Username:</Text>
        <input
          type='text'
          className='block w-full p-2 mb-4 border border-gray-300 rounded-md'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Button type='submit' className='w-full p-2 mb-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md'>Register</Button>
      </form>
    </Container>
  );
};

// Export the LandingPage component
export default LandingPage;

// Export the API endpoint
export { default as handler } from './ai-landing-page';