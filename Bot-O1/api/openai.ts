import { OPENAI_API_KEY } from '@env'; // Importing the env variable
import axios from 'axios'; // Importing axios

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
        model: 'text-davinci-003', // Choose any available model
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
    return response.data.choices[0].text.trim(); // Extracting response text
  } catch (error) {
    console.error('Error fetching response from OpenAI:', error);
    return "Sorry, I'm having trouble thinking right now. Could you ask me something else?";
  }
};
