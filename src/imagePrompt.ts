import axios from 'axios';

// Encode the image as a base64 string



export const imagePrompt = async(model: string, base64Image: string, prompt = 'Write a caption for this image:', {apiKey, temperature, max_tokens} = {apiKey: "", temperature: 0.5, max_tokens: 50}) => {
  const data = {
    prompt,
    max_tokens,
    temperature,
    image: base64Image,
  };
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };
  
  // Send the API request
  const response = await axios.post(
    'https://api.openai.com/v1/images/generations',
    data,
    config
  );  
  console.log(response.data);
}