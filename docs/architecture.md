# AI Codebase Assistant — Architecture

## Overview

AI Codebase Assistant allows an AI agent to explore and analyze codebases using structured tools.
The system connects a Python AI agent with Node.js-based code tools.

---

## Main Layers

1. AI Service (Python + LangChain)
2. Tool Execution Layer (Node.js)
3. Infrastructure Layer

---

## High Level Architecture

```
User
 |
 v
Python AI Service (LangChain Agent)
 |
 +-- Tool Client
 |
 v
Node Tools Service
 |
 +-- github_search
 +-- repo_reader
 +-- summarize_repo
 |
 v
Local Repository Cache
 |
 v
GitHub / Local Filesystem
```

---

## Components

### 1. AI Service

Responsible for reasoning and tool orchestration.

Location:

```
ai-service/
```

Structure:

```
app/
├── agent/
│   └── agent_runner.py
│
├── tools/
│   └── node_tool_client.py
│
└── main.py
```

Responsibilities:

* Run LangChain agent
* Select tools to execute
* Process tool responses
* Generate final answer

---

## Tool Execution Flow

```
User Query
 |
 v
LangChain Agent
 |
 v
Select Tool
 |
 v
Node Tool Client
 |
 v
Node Tool Execution
 |
 v
JSON Result
 |
 v
LLM Analysis
 |
 v
Final Response
```

---

## Node Tools Service

Location:

```
node-tools/
```

Structure:

```
src/
├── tools/
│   ├── repoReader.js
│   ├── githubSearch.js
│
├── repos/
│
└── index.js
```

Responsibilities:

* Search GitHub repositories
* Read repository files
* Access filesystem
* Return structured JSON responses

---

## Repository Cache

Repositories are stored locally for analysis.

```
node-tools/repos/
```

Example:

```
repos/
└── project-name/
    ├── package.json
    ├── src/
    └── README.md
```

---

## Data Flow

```
User Query
 |
 v
LangChain Agent
 |
 v
Tool Decision
 |
 v
Node Tool Execution
 |
 v
Tool Result
 |
 v
LLM Processing
 |
 v
Final Answer
```

---

## Tech Stack

| Layer           | Technology       |
| --------------- | ---------------- |
| AI Agent        | Python           |
| Framework       | LangChain        |
| LLM             | OpenAI           |
| Tools Runtime   | Node.js          |
| Storage         | Local filesystem |
| Version Control | GitHub           |

---

## Future Improvements

* Vector-based code search
* AST-based code analysis
* Multi-repository reasoning
* Code dependency graphs
* CI integration
