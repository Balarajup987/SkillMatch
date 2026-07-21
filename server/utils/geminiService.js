// import "dotenv/config";
// import { GoogleGenerativeAI }
// from "@google/generative-ai";

// console.log(
//   "gemini API Key:",
//   process.env.GEMINI_API_KEY
// );

// const genAI =
//   new GoogleGenerativeAI(
//     process.env.GEMINI_API_KEY
//   );

// export const analyzeResumeWithGemini =
//   async (resumeText) => {

//     const model =
//       genAI.getGenerativeModel({
//         model: "gemini-2.0-flash"
//       });

//     const prompt = `
// You are an ATS resume analyzer.

// Analyze this resume and return ONLY valid JSON.

// {
//   "score": number,
//   "strengths": [string],
//   "weaknesses": [string],
//   "suggestions": [string]
// }

// Rules:
// - score must be between 0 and 100
// - strengths max 3
// - weaknesses max 3
// - suggestions max 3

// Resume:
// ${resumeText}
// `;

//     const result =
//       await model.generateContent(
//         prompt
//       );

//     const response =
//       result.response.text();

//     return response;
// };