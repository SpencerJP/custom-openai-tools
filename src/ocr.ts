import { createWorker, ImageLike } from "tesseract.js";

export const convertImageToText = async (imageFileNameOrUrl: ImageLike) => {
  const worker = await createWorker();

  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const {
    data: { text },
  } = await worker.recognize(imageFileNameOrUrl);
  worker.terminate();
  return text;
};
