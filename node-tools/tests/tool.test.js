import { repoReader } from "../src/tools/repoReader.js";

test("repoReader reads file", async () => {
  const result = await repoReader.run({ path: "package.json" });

  expect(result).toHaveProperty("content");
});