const axios = require("axios");

async function ChatGpt(prompt, options = {}) {
  const messages = [
    {
      role: "system",
      content: options.system || "Kamu adalah Putri Zelda dari Kerajaan Hyrule.",
    },
    { role: "user", content: prompt },
  ];

  try {
    const { data } = await axios.post(
      "https://deepenglish.com/wp-json/ai-chatbot/v1/chat",
      { messages },
      {
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.error("ChatGpt Error:", error.message);
    throw error;
  }
}

async function gptpic(prompt, options = {}) {
  try {
    const { data } = await axios.post(
      "https://chat-gpt.pictures/api/generateImage",
      {
        captionInput: prompt,
        captionModel: "default",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.error("gptpic Error:", error.message);
    throw error;
  }
}

async function SeaArt(prompt, options = {}) {
  try {
    const { data } = await axios.post(
      "https://www.seaart.ai/api/v1/artwork/list",
      {
        page: 1,
        page_size: 40,
        order_by: "new",
        type: "community",
        keyword: prompt,
        tags: [],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const items = data.data?.items;
    if (!items || !items.length) throw new Error("No SeaArt items found.");

    return items[Math.floor(Math.random() * items.length)];
  } catch (error) {
    console.error("SeaArt Error:", error.message);
    throw error;
  }
}

async function Lbbai(prompt, options = {}) {
  const messages = [
    { role: "system", content: options.system || "Kamu adalah Putri Zelda dari Kerajaan Hyrule." },
    { role: "user", content: prompt },
  ];

  try {
    const { data } = await axios.post(
      "https://deepenglish.com/wp-json/ai-chatbot/v1/chat",
      { messages },
      {
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Lbbai Error:", error.message);
    throw error;
  }
}

class Gemini {
  constructor(key, apikey) {
    this.conversation_id = "";
    this.response_id = "";
    this.choice_id = "";
    this.image_url = null;
    this.image_name = null;
    this.tools = [];
    this.params = { bl: "", _reqid: "", rt: "c" };
    this.data = { "f.req": "", at: "" };
    this.post_url =
      "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate";

    this.headers = {
      Host: "gemini.google.com",
      "X-Same-Domain": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      Origin: "https://gemini.google.com",
      Referer: "https://gemini.google.com/",
      Cookie: `${key || "__Secure-1PSID"}=${
        apikey ||
        "g.a000gQhbTE4WvC7mwVL4CcWSxbt1Bde7Ady6qpt6951pafinWART4EEKmcskZMFX08uuSKwbvAACgYKAVYSAQASFQHGX2Mi1KAIQT0oz9dXZXKy0ioMBBoVAUF8yKpem3c3iJtHRDMQF3nSHOxU0076"
      }`,
    };
  }

  async question(prompt) {
    try {
      const res = await axios.get("https://gemini.google.com/", {
        headers: this.headers,
      });

      const snlM0e = res.data.match(/"SNlM0e":"(.*?)"/)?.[1];
      const blValue = res.data.match(/"cfb2h":"(.*?)"/)?.[1];

      if (!snlM0e || !blValue) {
        return { content: "Gagal mendapatkan token Gemini. Cek cookie Anda." };
      }

      this.data.at = snlM0e;
      this.params.bl = blValue;

      let req_id = parseInt(Math.random().toString().slice(2, 6));

      const requestArray = [
        [prompt, 0, null, [], null, null, 0],
        ["en"],
        [this.conversation_id, this.response_id, this.choice_id, null, null, []],
        null,
        null,
        null,
        [1],
        0,
        [],
        this.tools,
        1,
        0,
      ];

      this.params._reqid = `${req_id}`;
      this.data["f.req"] = JSON.stringify([null, JSON.stringify(requestArray)]);

      const postData = `f.req=${encodeURIComponent(
        this.data["f.req"]
      )}&at=${this.data.at}`;

      const urlWithParams = `${this.post_url}?${new URLSearchParams(this.params)}`;

      const response = await axios.post(urlWithParams, postData, {
        headers: this.headers,
      });

      const raw = response.data.split("\n")[3];
      const parsed = JSON.parse(raw)[0][2];

      if (!parsed) throw new Error("Empty response");

      const parsed_answer = JSON.parse(parsed);
      const result = {
        content: parsed_answer[4][0][1][0],
        conversation_id: parsed_answer[1][0],
        response_id: parsed_answer[1][1],
        textQuery: parsed_answer[2]?.[0] || "",
        choices: parsed_answer[4].map((i) => ({ id: i[0], content: i[1] })),
      };

      this.conversation_id = result.conversation_id;
      this.response_id = result.response_id;
      this.choice_id = result.choices?.[0]?.id;
      return result;
    } catch (error) {
      console.error("Gemini Error:", error.message);
      return { content: `Error: ${error.message}` };
    }
  }
}

module.exports = {
  ChatGpt,
  gptpic,
  Gemini,
  SeaArt,
  Lbbai,
};

// Hot Reload
const fs = require("fs");
const file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log("Update gpt.js");
  delete require.cache[file];
  require(file);
});
