import axios from "axios";
import { ChatCompletionRequestMessage } from "openai";

const BASE_URL = "https://api.openai.com/v1/";

const CHAT_COMPLETION_URL = `${BASE_URL}chat/completions`;
const REGULAR_COMPLETION_URL = `${BASE_URL}completions`;

const MODEL_MAX_TOKENS = {
  curie: 1000,
  davinci: 1000,
  gpt: 4000,
  codex: 8000,
  "4": 8000,
};
const MODELS = {
  curie: "text-curie-001",
  davinci: "text-davinci-003",
  gpt: "gpt-3.5-turbo",
  codex: "code-davinci-002",
  "4": "gpt-4",
};

export async function runPrompt(
  model: string,
  prompt: string,
  {
    temperature,
    maxTokens,
    apiKey,
  }: { temperature?: number; maxTokens?: number; apiKey: string }
) {
  try {
    const max_tokens = Math.min(
      (Number(maxTokens) || MODEL_MAX_TOKENS[model]) - prompt.length
    );
    const url = REGULAR_COMPLETION_URL;
    const response = await axios.post(
      url,
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
    return result;
  } catch (error) {
    console.log(error);
    console.error(error.response.status);
    console.error(error.response.data);
    throw error;
  }
}

export async function runChat(
  model: string,
  chat: ChatCompletionRequestMessage[],
  {
    temperature,
    maxTokens,
    apiKey,
  }: { temperature?: number; maxTokens?: number; apiKey: string }
) {
  try {
    const max_tokens = Math.min(
      (Number(maxTokens) || MODEL_MAX_TOKENS[model]) - chat[0].content.length
    );
    const url = CHAT_COMPLETION_URL;

    if (chat[0].role !== "system") {
      chat.unshift({
        role: "system",
        content:
          "You are ChatGPT, a large language model trained by OpenAI, and you are a helpful technical assistant to a senior developer. Answer as concisely as possible.",
      });
    }

    const response = await axios.post(
      url,
      {
        model: MODELS[model],
        max_tokens,
        messages: chat,
        temperature: temperature || 0.2,
        stop: ["[DONE]"],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const result = response.data.choices[0].message.content;
    console.log(response.data.usage.total_tokens);
    return result;
  } catch (error) {
    console.log(error);
    console.error(error.response.status);
    console.error(error.response.data);
    return "Error";
  }
}
