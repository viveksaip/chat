// api/chat.js
require('dotenv').config();
const { OpenAI } = require('openai');  // OpenAI SDK

// Initialize OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Use API key from .env file
});

// Vercel Serverless Function
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;  // Extract prompt from the request body

    try {
      // Use OpenAI API to generate a response based on the user's input
      const response = await openai.chat.completions.create({
        model: 'gpt-4', // You can use gpt-4 or gpt-3.5-turbo
        messages: [{ role: 'user', content: prompt }],
      });

      // Send the AI response back to the client
      res.status(200).json({ response: response.choices[0].message.content });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error generating response' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
