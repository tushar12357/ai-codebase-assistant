import { execSync } from "child_process";
import { tool } from "langchain-toolkit";
import path from "path";
import fs from "fs";

export const cloneRepo = tool({
  name: "clone_repo",
  description: "Clone a GitHub repository locally",

  schema: {
    url: "string",
  },

  async execute({ url }) {
    const repoName = url.split("/").pop().replace(".git", "");

    const targetDir = path.join(process.cwd(), "repos", repoName);

    if (!fs.existsSync("repos")) {
      fs.mkdirSync("repos");
    }

    if (!fs.existsSync(targetDir)) {
      execSync(`git clone --depth 1 ${url} ${targetDir}`);
    }

    return {
      repo: repoName,
      path: targetDir,
    };
  },
});
