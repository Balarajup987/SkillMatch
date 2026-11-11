
import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { analyzeResumeWithAI } from "../utils/aiService.js";

// Convert AI response into a JavaScript object
const parseAIResult = (atsResult) => {
  if (
    typeof atsResult === "object" &&
    atsResult !== null &&
    !Array.isArray(atsResult)
  ) {
    return atsResult;
  }

  if (typeof atsResult !== "string") {
    throw new Error("Invalid AI response format");
  }

  const cleanResult = atsResult
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanResult);
};

// Validate AI response
const validateAIResult = (result) => {
  if (
    typeof result.score !== "number" ||
    !Array.isArray(result.strengths) ||
    !Array.isArray(result.weaknesses) ||
    !Array.isArray(result.suggestions)
  ) {
    throw new Error("AI returned an invalid ATS result");
  }

  return result;
};

// Extract text from PDF
export const extractResumeText = async (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error("Resume PDF file not found");
  }

  const data = new Uint8Array(
    fs.readFileSync(filePath)
  );

  const pdf = await pdfjsLib.getDocument({
    data
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(" ");

    text += pageText + " ";
  }

  if (!text.trim()) {
    throw new Error("No readable text found in resume PDF");
  }

  return text.trim();
};

// Parse resume text
export const parseResume = async (req, res) => {
  try {
    const filePath = req.body.filePath;

    const text = await extractResumeText(filePath);

    return res.status(200).json({
      text
    });

  } catch (error) {
    console.error("Resume Parsing Error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};

// Analyze resume using AI
export const analyzeResumeATS = async (req, res) => {
  try {
    const filePath = req.body.filePath;

    const resumeText = await extractResumeText(filePath);

    const atsResult = await analyzeResumeWithAI(resumeText);

    const parsedResult = validateAIResult(
      parseAIResult(atsResult)
    );

    console.log("Parsed AI result:", parsedResult);

    return res.status(200).json({
      parsedResult
    });

  } catch (error) {
    console.error("ATS Analysis Error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};
