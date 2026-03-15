import express from "express";
import registry from "../registry/toolRegistry.js";

const router = express.Router();

router.get("/tools", (req, res) => {
  const tools = registry.getAll().map((tool) => ({
    name: tool.name,
    description: tool.description,
    schema: tool.schema || {},
  }));

  res.json(tools);
});

router.post("/tool/:name", async (req, res) => {
  try {
    const tool = registry.get(req.params.name);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    const result = await tool.run(req.body);

    res.json(result);
  } catch (err) {
    console.error("Tool execution error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
