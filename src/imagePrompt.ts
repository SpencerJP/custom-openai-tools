import axios from 'axios';

const BASE_URL = 'https://api.openai.com/v1/completions';

const MODEL_MAX_TOKENS = {
    curie: 1000,
    davinci: 1000,
    gpt: 4000,
    codex: 8000,
    image: 50
}
const MODELS = {
    curie: "text-curie-001",
    davinci: "text-davinci-003",
    gpt: "gpt-3.5-turbo",
    codex: "code-davinci-002",
    image: "image-alpha-001"

}

export const imagePrompt = async(model = 'image', base64Image: string, prompt = 'Write a caption for this image:', config: {apiKey: string, temperature: number, maxTokens: number}) => {
  const {apiKey, temperature, maxTokens} = config;

  const max_tokens = Math.min((Number(maxTokens) || MODEL_MAX_TOKENS[model]) - prompt.length)
  const data = {
    prompt,
    max_tokens,
    temperature: temperature || 0.4,
    image: base64Image,
    model: MODELS[model]
  };

  console.log(data);
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };
  
  // Send the API request
  try {
    const response = await axios.post(
      BASE_URL,
      data,
      axiosConfig
    );
    console.log(response);
    console.log(response.data);
  }
  catch (error) {
    console.error(error.response.status)
    console.error(error.response.data)
  }
}