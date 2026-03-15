import { codeAnalysisWorkflow } from "../src/workflows/codeAnalysisWorkflow.js";

test("workflow executes", async () => {
  const result = await codeAnalysisWorkflow.run({
    path: "package.json",
  });

  expect(result).toHaveProperty("summary");
});