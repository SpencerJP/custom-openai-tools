import axios from "axios";

const BASE_URL = "https://api.openai.com/v1/completions";

const MODEL_MAX_TOKENS = {
    curie: 1000,
    davinci: 1000,
    gpt: 4000,
    codex: 8000
}
const MODELS = {
    curie: "text-curie-001",
    davinci: "text-davinci-003",
    gpt: "gpt-3.5-turbo",
    codex: "code-davinci-002"

}

export async function runPrompt(model: string, prompt: string, {temperature, maxTokens, apiKey}: { temperature?: number, maxTokens?: number, apiKey: string }) {
    try {
      const max_tokens = Math.min((Number(maxTokens) || MODEL_MAX_TOKENS[model]) - prompt.length)
      const response = await axios.post(
        BASE_URL,
        {
          model: MODELS[model],
          prompt: prompt,
          max_tokens,
          temperature: temperature || 0.4,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const result = response.data.choices[0].text;
      console.log(result);
      console.log(response.data.usage.total_tokens);
    } catch (error) {
      console.error(error.response.status)
      console.error(error.response.data)
    }
  }