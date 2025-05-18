const axios = require('axios');

async function ttSearch(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        "https://tikwm.com/api/feed/search",
        `keywords=${encodeURIComponent(query)}&count=12&cursor=0&web=1&hd=1`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": "current_language=en",
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
          },
        }
      );

      resolve(response.data.data);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = ttSearch;
