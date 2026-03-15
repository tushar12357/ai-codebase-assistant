const axios = require("axios");

describe("AI Agent Pipeline", () => {

  const AI_URL = "http://localhost:8000/ask";

  test("should summarize package.json", async () => {

    const response = await axios.post(AI_URL, {
      query: "summarize package.json"
    });

    expect(response.status).toBe(200);

    expect(response.data).toHaveProperty("answer");
  });

});