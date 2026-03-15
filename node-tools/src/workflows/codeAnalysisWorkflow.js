import { ToolWorkflow } from "langchain-toolkit";
import { repoReader } from "../tools/repoReader.js";
import { summarizeCode } from "../tools/summarizeCode.js";

export const codeAnalysisWorkflow = new ToolWorkflow()
  .step(repoReader)
  .step({
    name: "summarize_step",
    async run(data) {
      return summarizeCode.run({ content: data.content });
    },
  });