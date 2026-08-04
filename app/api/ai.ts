// Import necessary packages
import axios from 'axios';

// Define the AI API endpoint
export const getAIResponse = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.get('https://api.example.com/ai');
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching AI response' });
  }
};