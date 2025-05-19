const axios = require('axios');
const crypto = require('crypto');

class Gemini {
  constructor(key, apikey) {
    this.conversation_id = '';
    this.response_id = '';
    this.choice_id = '';
    this.image_url = null;
    this.image_name = null;
    this.tools = [];
    this.params = { bl: '', _reqid: '', rt: 'c' };
    this.data = { 'f.req': '', at: '' };
    this.post_url = 'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate';
    this.headers = this.setupHeaders(key, apikey);
  }

  setupHeaders(key, apikey) {
    return {
      "Host": "gemini.google.com",
      "X-Same-Domain": "1",
      "User-Agent": "Mozilla/5.0",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Origin": "https://gemini.google.com",
      "Referer": "https://gemini.google.com/",
      "Cookie": `${key || '__Secure-1PSID'}=${apikey || 'ISI_KEY_KAMU'}`
    };
  }

  async question(query) {
    try {
      const response = await axios.get('https://gemini.google.com/', { headers: this.headers });
      const geminiText = response.data;

      const snlM0e = geminiText.match(/"SNlM0e":"(.*?)"/)?.[1] || '';
      const blValue = geminiText.match(/"cfb2h":"(.*?)"/)?.[1] || '';
      if (!snlM0e || !blValue) return { content: "Authentication Failed or bl not found" };

      this.data.at = snlM0e;
      this.params.bl = blValue;

      const req_id = parseInt(crypto.randomBytes(2).toString('hex'), 16); // 4-digit acak
      const imageList = this.image_url ? [[[this.image_url, 1], this.image_name]] : [];
      const requestArray = [
        [query, 0, null, imageList, null, null, 0], ["en"],
        [this.conversation_id, this.response_id, this.choice_id, null, null, []],
        null, null, null, [1], 0, [], this.tools, 1, 0
      ];

      this.params._reqid = String(req_id);
      this.data['f.req'] = JSON.stringify([null, JSON.stringify(requestArray)]);

      const postData = `f.req=${encodeURIComponent(this.data['f.req'])}&at=${this.data.at}`;
      const urlWithParams = `${this.post_url}?${new URLSearchParams(this.params)}`;

      const responsePost = await axios.post(urlWithParams, postData, { headers: this.headers });
      const lines = responsePost.data.split('\n');
      const resp_dict = JSON.parse(lines[3])[0][2];

      if (!resp_dict) return { content: "No response from Gemini" };

      const parsed = JSON.parse(resp_dict);
      const answer = {
        content: parsed[4][0][1][0],
        conversation_id: parsed[1][0],
        response_id: parsed[1][1],
        factualityQueries: parsed[3],
        textQuery: parsed[2]?.[0] || '',
        choices: parsed[4].map(i => ({ id: i[0], content: i[1] }))
      };

      this.conversation_id = answer.conversation_id;
      this.response_id = answer.response_id;
      this.choice_id = answer.choices[0]?.id;
      return answer;
    } catch (error) {
      console.error(error);
      return { content: `Error: ${error.message}` };
    }
  }
}

module.exports = { Gemini };
