import fs from "fs";
import { tool } from "langchain-toolkit";
import path from "path";

export const repoReader = tool({
  name: "repo_reader",
  description: "Read a file from a repository",

  schema: {
    path: "string",
  },

  async execute({ path: filePath }) {
    const fullPath = path.join(process.cwd(), "repos", filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    const content = fs.readFileSync(fullPath, "utf-8");

    return {
      content,   
      path: fullPath,
    };
  },
});