import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
// import {analyzeResumeWithGemini} from "../utils/geminiService.js";
import { analyzeResumeWithAI } from "../utils/aiService.js";
import path from "path";

export const extractResumeText = async (
  filePath
) => {
  const data = new Uint8Array(
    fs.readFileSync(filePath)
  );

  const pdf = await pdfjsLib.getDocument({
    data
  }).promise;

  let text = "";

  for (
    let i = 1;
    i <= pdf.numPages;
    i++
  ) {
    const page =
      await pdf.getPage(i);

    const content =
      await page.getTextContent();

    const pageText =
      content.items
        .map((item) => item.str)
        .join(" ");

    text += pageText + " ";
  }

  return text;
};

export const parseResume = async (
  req,
  res
) => {
  try {
    const filePath =
      req.body.filePath;

    const text =
      await extractResumeText(
        filePath
      );

    res.status(200).json({
      text
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export const analyzeResumeATS =
  async (req, res) => {
    try {
      const filePath =
        req.body.filePath;

      const resumeText =
        await extractResumeText(
          filePath
        );

      const atsResult = await analyzeResumeWithAI(resumeText);
        const cleanResult =
          atsResult
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      const parsedResult =
        JSON.parse(cleanResult);


      res.status(200).json({
        parsedResult
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message
      });
    }
};