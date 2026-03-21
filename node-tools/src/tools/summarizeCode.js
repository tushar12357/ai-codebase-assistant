import { tool } from "langchain-toolkit";

export const summarizeCode = tool({
  name: "summarize_code",
  description: "Summarize a block of code",

  schema: {
    content: "string",
  },

  async execute({ content }) {

    const prompt = `
You are a senior software engineer.

Summarize the following code:

- What does it do?
- Key components/functions
- Tech stack (if visible)
- Keep it concise (5-6 lines max)

Code:
${content.slice(0, 8000)}
`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    const data = await res.json();
console.log("GROQ RESPONSE:", data);
    return {
      summary: data.choices?.[0]?.message?.content || "No summary generated",
    };
  },
});