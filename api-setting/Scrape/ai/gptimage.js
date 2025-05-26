const axios = require("axios"); // npm install axios

async function gpt1image(query) {
  if (!query) throw new Error("Deskripsikan gambar yang ingin kamu buat.");

  const headers = {
    "content-type": "application/json",
    "referer": "https://gpt1image.exomlapi.com/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
  };

  const body = {
    prompt: query,
    n: 1,
    size: "1024x1024",
    is_enhance: true,
    response_format: "url"
  };

  try {
    const { data } = await axios.post(
      "https://gpt1image.exomlapi.com/v1/images/generations",
      body,
      { headers }
    );

    const url = data?.data?.[0]?.url;
    if (!url) {
      throw new Error("Fetch berhasil tapi URL hasil kosong." +
        (data.error ? `\nError dari server: ${data.error}` : ""));
    }

    return `Sabar yah, sedang membuat: "${query}". Proses ini memang agak lama, tunggu sebentar...\n\nHasil gambar: ${url}`;
  } catch (err) {
    if (err.response) {
      throw new Error(`Gagal: ${err.response.status} ${err.response.statusText}\n${JSON.stringify(err.response.data)}`);
    } else {
      throw new Error("Error saat mengirim request: " + err.message);
    }
  }
}

module.exports = gpt1image;
