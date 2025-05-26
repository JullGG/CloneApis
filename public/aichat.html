<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Zelda AI Chat</title>
  <style>
    :root {
      --bg-light: #f7f9fc;
      --bg-dark: #1e1e2f;
      --text-light: #333;
      --text-dark: #eee;
      --bot-bg: #e5f0ff;
      --user-bg: #e6e6e6;
      --bubble-radius: 16px;
    }

    [data-theme="light"] {
      --bg: var(--bg-light);
      --text: var(--text-light);
    }

    [data-theme="dark"] {
      --bg: var(--bg-dark);
      --text: var(--text-dark);
    }

    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .chat-container {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .message {
      display: flex;
      align-items: flex-end;
      max-width: 80%;
    }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message.bot {
      align-self: flex-start;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      margin: 0 8px;
    }

    .bubble {
      background: var(--user-bg);
      padding: 10px 14px;
      border-radius: var(--bubble-radius);
      position: relative;
    }

    .message.bot .bubble {
      background: var(--bot-bg);
    }

    .bubble .meta {
      font-size: 10px;
      color: gray;
      margin-top: 4px;
      text-align: right;
    }

    .chat-input {
      display: flex;
      padding: 12px;
      border-top: 1px solid #ccc;
      background: white;
    }

    .chat-input input {
      flex: 1;
      padding: 10px;
      border-radius: 20px 0 0 20px;
      border: 1px solid #ccc;
      outline: none;
    }

    .chat-input button {
      background: #3b82f6;
      border: none;
      padding: 10px 16px;
      color: white;
      border-radius: 0 20px 20px 0;
      cursor: pointer;
    }

    .chat-input button:hover {
      background: #2563eb;
    }
  </style>
</head>
<body>
  <div class="chat-container" id="chatContainer">
    <!-- Chat messages will be injected here -->
  </div>
  <form class="chat-input" id="chatForm">
    <input type="text" id="userInput" placeholder="Type your message here..." required />
    <button type="submit">➤</button>
  </form>

  <script>
    const chatContainer = document.getElementById('chatContainer');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');

    function addMessage(content, sender = 'user') {
      const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const message = document.createElement('div');
      message.className = `message ${sender}`;

      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.innerHTML = sender === 'user' ? '🧑' : '🤖';

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerHTML = `<div>${content}</div><div class="meta">${time}</div>`;

      message.appendChild(avatar);
      message.appendChild(bubble);
      chatContainer.appendChild(message);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = userInput.value.trim();
      if (!message) return;

      addMessage(message, 'user');
      userInput.value = '';

      // Bot thinking...
      addMessage('...', 'bot');
      const loader = chatContainer.querySelector('.message.bot:last-child .bubble div:first-child');

      try {
        const res = await fetch('/api-setting/Scrape/ai/ai-gpt', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ prompt: message })
        });

        const data = await res.json();
        loader.innerText = data.response || 'Bot tidak membalas.';
      } catch (err) {
        loader.innerText = 'Terjadi kesalahan: ' + err.message;
      }
    });
  </script>
</body>
</html>
