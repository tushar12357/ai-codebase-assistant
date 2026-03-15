import fs from "fs";
import { tool } from "langchain-toolkit";

export const repoReader = tool({
  name: "repo_reader",
  description: "Read a file from repository",

  schema: {
    path: "string"
  },

  retries: 1,
  debug: true,

  async execute({ path }) {
    const content = fs.readFileSync(path, "utf-8");

    return {
      path,
      content
    };
  }
});