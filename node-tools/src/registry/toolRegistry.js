import { ToolRegistry } from "langchain-toolkit";

import { repoReader } from "../tools/repoReader.js";
import { summarizeCode } from "../tools/summarizeCode.js";
import { githubSearch } from "../tools/githubSearch.js";
import { cloneRepo } from "../tools/cloneRepo.js";

const registry = new ToolRegistry();

registry.register(repoReader);
registry.register(summarizeCode);
registry.register(githubSearch);
registry.register(cloneRepo);

export default registry;