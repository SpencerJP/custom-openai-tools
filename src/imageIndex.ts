import * as base64Img from 'base64-img';
import dotenv from "dotenv";
import { existsSync } from "fs";
import { imagePrompt } from "./imagePrompt";
dotenv.config();
const argv = process.argv.slice(2);

const CURRENT_MODEL = process.env["API_MODEL"] || argv[1] || "gpt"

let base64Image = "";
if (!argv[0]) {
    base64Image = base64Img.base64Sync(`images/${argv[0]}`);
} else {
    const fileExists = existsSync(`images/${argv[0]}`);
    if(fileExists) {
        base64Image = base64Img.base64Sync(`images/${argv[0]}`);
    } else {
        console.log("File does not exist");
        base64Image = argv[0];
    }
}

const prompt = 

imagePrompt(CURRENT_MODEL, base64Image, undefined, {apiKey: process.env.API_KEY, temperature: Number(argv[2]), max_tokens:Number(argv[3])});
