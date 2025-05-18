const axios = require('axios');

async function scrapeZeroGPT(query) {
  const id = () => Math.random().toString(36).slice(2, 18);

  const res = await axios.post('https://zerogptai.org/wp-json/mwai-ui/v1/chats/submit', {
    botId: "default",
    customId: null,
    session: "N/A",
    chatId: id(),
    contextId: 39,
    messages: [],
    newMessage: query,
    newFileId: null,
    stream: true
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': 'e7b64e1953',
      'Accept': 'text/event-stream'
    },
    responseType: 'stream'
  });

  return new Promise((resolve) => {
    let result = '';
    res.data.on('data', chunk => {
      chunk.toString().split('\n').forEach(line => {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'live') result += data.data;
            if (data.type === 'end') resolve(result);
          } catch (e) {
            // skip parsing errors
          }
        }
      });
    });
  });
}

// Contoh langsung pakai
(async () => {
  const query = 'apa itu AI'; // ubah dengan query dinamis kalau mau
  try {
    const hasil = await scrapeZeroGPT(query);
    console.log('Hasil:', hasil);
  } catch (err) {
    console.error('Gagal:', err.message);
  }
})();
