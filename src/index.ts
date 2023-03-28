import { exec } from "child_process";
import dotenv from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { runChat, runPrompt } from "./prompt";

dotenv.config();
const argv = process.argv.slice(2);
const {API_KEY} = process.env;

if(!API_KEY) {
    console.log("Please set your API key in the .env file");
    process.exit(1);
}

const CURRENT_MODEL = process.env["API_MODEL"] || argv[1] || "4"

let prompt = "";
if (!argv[0]) {
  prompt = readFileSync("./prompts/1.txt").toString();
} else {
    const fileExists = existsSync(`./prompts/${argv[0]}.txt`);
    if(fileExists) {
        prompt = readFileSync(`./prompts/${argv[0]}.txt`).toString();
    } else {
        console.log("File does not exist");
        prompt = argv[0];
    }
}

// get the string "temperature:x maxTokens:y" from the prompt and then remove them from the prompt. Both are optional.
const temperatureRegex = /temperature:(\d\.\d)/g;
const maxTokensRegex = /maxTokens:(\d+)/g;
const temperatureMatch = temperatureRegex.exec(prompt);
const maxTokensMatch = maxTokensRegex.exec(prompt);
prompt = prompt.replace(temperatureRegex, "").replace(maxTokensRegex, "");
const temperature = Number(temperatureMatch?.[1]) || Number(argv[2]) || 0.4;
const maxTokens = Number(maxTokensMatch?.[1]) || Number(argv[3]) || undefined;

(async () => {
let result: string;
if(CURRENT_MODEL === "4") {
    result = await runChat(CURRENT_MODEL, [{role: "user", content: prompt}], {apiKey:API_KEY, temperature: temperature, maxTokens:maxTokens});
}
else {
    result = await runPrompt(CURRENT_MODEL, prompt, {apiKey:API_KEY, temperature: Number(argv[2]), maxTokens:Number(argv[3])});
}
console.log(result)
try {mkdirSync("./outputs")} catch(e) {}
writeFileSync("./outputs/output.md", result)
exec("code ./outputs/output.md")})()
