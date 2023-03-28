import { exec } from "child_process";
import dotenv from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { convertImageToText } from "./ocr";
import { runChat, runPrompt } from "./prompt";

dotenv.config();
const argv = process.argv.slice(2);
const { API_KEY } = process.env;

if (!API_KEY) {
  console.log("Please set your API key in the .env file");
  process.exit(1);
}

const CURRENT_MODEL = process.env["API_MODEL"] || argv[1] || "4";

let textFromImage: Buffer | string;
if (!argv[0]) {
  textFromImage = readFileSync(`images/1.png`);
} else {
  const fileExists = existsSync(`images/${argv[0]}`);
  if (fileExists) {
    textFromImage = readFileSync(`images/${argv[0]}`);
  } else {
    const fileExists = existsSync(`${argv[0]}`);
    if (fileExists) {
      textFromImage = readFileSync(`${argv[0]}`);
    } else {
      throw new Error("File does not exist");
    }
  }
}

console.log(CURRENT_MODEL);

(async () => {
  textFromImage = await convertImageToText(textFromImage);

  const temperatureRegex = /temperature:(\d\.\d)/g;
  const maxTokensRegex = /maxTokens:(\d+)/g;
  const temperatureMatch = temperatureRegex.exec(textFromImage);
  const maxTokensMatch = maxTokensRegex.exec(textFromImage);
  textFromImage = textFromImage
    .replace(temperatureRegex, "")
    .replace(maxTokensRegex, "");
  const temperature = Number(temperatureMatch?.[1]) || Number(argv[2]) || 0.4;
  const maxTokens = Number(maxTokensMatch?.[1]) || Number(argv[3]) || undefined;
  let result: string;
  if (CURRENT_MODEL === "4") {
    result = await runChat(
      CURRENT_MODEL,
      [{ role: "user", content: textFromImage }],
      {
        apiKey: API_KEY,
        temperature: temperature,
        maxTokens: maxTokens,
      }
    );

    //   const result = await imagePrompt(CURRENT_MODEL, textFromImage, undefined, {
    //     apiKey: API_KEY,
    //     temperature: Number(argv[2]),
    //     maxTokens: Number(argv[3]),
    //   });
  } else {
    result = await runPrompt(CURRENT_MODEL, textFromImage, {
      apiKey: API_KEY,
      temperature: Number(argv[2]),
      maxTokens: Number(argv[3]),
    });
  }
  console.log(result);
  try {
    mkdirSync("./outputs");
  } catch (e) {}
  writeFileSync("./outputs/output.md", result);
  exec("code ./outputs/output.md");
})();
