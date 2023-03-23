import { readFileSync, existsSync } from "fs";
import dotenv from "dotenv";
import { runPrompt } from "./prompt";

dotenv.config();
const argv = process.argv.slice(2);

const CURRENT_MODEL = process.env["API_MODEL"] || argv[1] || "gpt"

let prompt = "";
if (!argv[0]) {
  prompt = readFileSync("prompts/1.txt").toString();
} else {
    const fileExists = existsSync(`prompts/${argv[0]}.txt`);
    if(fileExists) {
        prompt = readFileSync(`prompts/${argv[0]}.txt`).toString();
    } else {
        console.log("File does not exist");
        prompt = argv[0];
    }
}

runPrompt(CURRENT_MODEL, prompt, {apiKey: process.env.API_KEY, temperature: Number(argv[2]), maxTokens:Number(argv[3])});
