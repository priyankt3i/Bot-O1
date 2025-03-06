// api/openai.ts
import axios from 'axios';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Fetch the OpenAI API key from the environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/completions';

export const getOpenAIResponse = async (userMessage: string) => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is missing!');
    return "Sorry, I couldn't process your request. Please try again later.";
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'text-davinci-003', // You can choose any available model
        prompt: userMessage,
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text.trim(); // Extracting the response text from the OpenAI API
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    return "Sorry, I'm having trouble thinking right now. Could you ask me something else?";
  }
};
