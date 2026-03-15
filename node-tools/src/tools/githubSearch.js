import { tool } from "langchain-toolkit";

export const githubSearch = tool({
  name: "github_search",
  description: "Search GitHub repositories",

  schema: {
    query: "string",
  },

  async execute({ query }) {
    // if query is a github url
    if (query.includes("github.com")) {

  const repo = query.split("github.com/")[1];

  const res = await fetch(
    `https://api.github.com/repos/${repo}`,
    { headers: { "User-Agent": "langchain-agent" } }
  );

  const data = await res.json();

  return [{
    name: data.full_name,
    url: data.html_url,
    stars: data.stargazers_count
  }];
}

    const res = await fetch(
      `https://api.github.com/search/repositories?q=${query}`,
      {
        headers: {
          "User-Agent": "langchain-agent",
        },
      },
    );

    const data = await res.json();

    return data.items.slice(0, 5).map((repo) => ({
      name: repo.full_name,
      url: repo.html_url,
      stars: repo.stargazers_count,
    }));
  },
});
