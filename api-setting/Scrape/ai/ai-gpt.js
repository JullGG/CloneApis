const axios = require('axios');
const qs = require('qs');
 
async function askChatbot(query) {
  const data = qs.stringify({
    action: 'do_chat_with_ai',
    ai_chatbot_nonce: '22aa996020',
    ai_name: 'gpt ai',
    instruction: 'kamu adalah gpt ai,salah satu ai paling pintar. kamu harus mampu menjawab semua pertanyaan',
    user_question: query
  });
 
  const config = {
    method: 'POST',
    url: 'https://onlinechatbot.ai/wp-admin/admin-ajax.php',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Cookie': '_ga_PKHPWJ2GVY=GS1.1.1732933582.1.1.1732933609.0.0.0; _ga=GA1.1.261902946.1732933582'
    },
    data
  };
 
  try {
    return (await axios(config)).data;
  } catch (error) {
    console.error('Error:', error);
    return 'Terjadi kesalahan saat menghubungi chatbot.';
  }
}

module.exports = askChatbot;
