import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const analyzeResumeWithAI =
  async (resumeText) => {
    const completion =
      await groq.chat.completions.create({
        model:
          "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `
You are an ATS resume analyzer.

Analyze this resume and return ONLY valid JSON.

{
  "score": number,
  "strengths": [string],
  "weaknesses": [string],
  "suggestions": [string]
}

Rules:
- score between 0 and 100
- strengths max 3
- weaknesses max 3
- suggestions max 3

Resume:
${resumeText}
`
          }
        ]
      });

    return completion
      .choices[0]
      .message.content;
};