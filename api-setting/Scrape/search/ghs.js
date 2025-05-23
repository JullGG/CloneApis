const axios = require('axios');

async function githubSearch(query) {
  if (!query) throw new Error('Masukkan query pencarian repositori.');

  const encodedQuery = encodeURIComponent(query);
  const apiUrl = `https://api.github.com/search/repositories?q=${encodedQuery}`;
  const response = await axios.get(apiUrl);

  if (!response.data.items || response.data.items.length === 0) {
    return [];
  }

  const maxRepos = 25;
  const results = [];

  for (let i = 0; i < Math.min(maxRepos, response.data.items.length); i++) {
    const repo = response.data.items[i];
    results.push({
      name: repo.name,
      owner: repo.owner.login,
      description: repo.description || "Deskripsi tidak tersedia",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || "Tidak ada bahasa yang ditentukan",
      zip: `https://github.com/${repo.owner.login}/${repo.name}/archive/refs/heads/main.zip`
    });
  }

  return results;
}

module.exports = githubSearch;
