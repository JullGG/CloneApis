const axios = require('axios');

async function githubDownload(url) {
  if (!url) throw new Error('Masukkan URL GitHub.');

  const apiUrl = `https://api.nekorinn.my.id/downloader/github-clone?url=${encodeURIComponent(url)}`;
  const response = await axios.get(apiUrl);

  if (!response.data.status || !response.data.result) {
    throw new Error('Gagal mengambil data dari API. Pastikan URL yang diberikan benar.');
  }

  const { name, owner, description, stars, forks, size, repoUrl } = response.data.result.metadata;
  const downloadUrl = response.data.result.downloadUrl.zip;

  return {
    name,
    owner: owner.username,
    description: description || "Tidak ada deskripsi",
    stars,
    forks,
    size,
    repoUrl,
    downloadUrl
  };
}

module.exports = githubDownload;
