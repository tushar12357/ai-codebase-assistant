import { tool } from "langchain-toolkit";

export const summarizeCode = tool({
  name: "summarize_code",
  description: "Summarize a block of code",

  schema: {
    content: "string",
  },

  retries: 1,
  debug: true,

  async execute({ content }) {
    const lines = content.split("\n");

    return {
      summary: `Code file with ${lines.length} lines`,
      preview: lines.slice(0, 10).join("\n"),
    };
  },
});