import registry from "../src/registry/toolRegistry.js";

export async function executeTool(name, input) {
  const tool = registry.get(name);

  if (!tool) {
    throw new Error(`Tool "${name}" not found`);
  }

  return await tool.run(input);
}

export async function listTools() {
  return registry.getAll().map((t) => ({
    name: t.name,
    description: t.description,
  }));
}