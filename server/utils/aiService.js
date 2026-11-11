
import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const analyzeResumeWithAI = async (resumeText) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are an ATS resume analyzer.
Analyze resumes and return valid JSON only.

Required structure:
{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Rules:
- Score must be between 0 and 100.
- Maximum 3 strengths.
- Maximum 3 weaknesses.
- Maximum 3 suggestions.
- Do not include markdown or explanations outside JSON.`
        },
        {
          role: "user",
          content: `Analyze this resume:\n\n${resumeText}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const result = completion.choices[0].message.content;

    return JSON.parse(result);

  } catch (error) {
    console.error("Groq Resume Analysis Error:", error.message);
    throw new Error("Resume analysis failed. Please try again.");
  }
};
