<!-- language: HTML, file: public/index.html, target: Vercel Static Hosting -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Terminal</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: #131313; color: #ececec; display: flex; flex-direction: column; height: 100vh; }
        #chat-container { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; max-width: 800px; width: 100%; margin: 0 auto; }
        .message { padding: 12px 16px; border-radius: 8px; max-width: 85%; line-height: 1.5; word-break: break-word; white-space: pre-wrap; }
        .user { background: #2f2f2f; align-self: flex-end; color: #fff; }
        .assistant { background: #1e1e1e; align-self: flex-start; border: 1px solid #2a2a2a; color: #d4d4d4; }
        #input-container { padding: 20px; background: #131313; border-top: 1px solid #222; display: flex; justify-content: center; }
        #input-wrapper { display: flex; max-width: 800px; width: 100%; background: #1e1e1e; border: 1px solid #333; border-radius: 8px; padding: 8px; align-items: flex-end; }
        textarea { flex: 1; background: transparent; border: none; color: #fff; resize: none; outline: none; padding: 8px; max-height: 150px; font-size: 14px; }
        button { background: #ffffff; color: #131313; border: none; padding: 8px 16px; border-radius: 4px; font-weight: 600; cursor: pointer; margin-left: 8px; }
        button:hover { background: #dcdcdc; }
    </style>
</head>
<body>
    <div id="chat-container"></div>
    <div id="input-container">
        <div id="input-wrapper">
            <textarea id="prompt-input" placeholder="Send a message..." rows="1" autofocus></textarea>
            <button id="send-btn">Send</button>
        </div>
    </div>

    <script>
        const chatContainer = document.getElementById('chat-container');
        const promptInput = document.getElementById('prompt-input');
        const sendBtn = document.getElementById('send-btn');

        async function handleSubmit() {
            const text = promptInput.value.trim();
            if (!text) return;

            appendMessage(text, 'user');
            promptInput.value = '';
            promptInput.style.height = 'auto';

            const loadingId = appendMessage('...', 'assistant');

            try {
                const res = await fetch('/api/index', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: text })
                });
                const data = await res.json();
                
                let output = data.response;
                if (typeof output === 'object') {
                    output = JSON.stringify(output, null, 2);
                }
                document.getElementById(loadingId).innerText = output || data.message || 'No response';
            } catch (err) {
                document.getElementById(loadingId).innerText = 'Error: Connection failed';
            }
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function appendMessage(text, sender) {
            const msg = document.createElement('div');
            const id = 'msg-' + Math.random().toString(36.substr(2, 9));
            msg.id = id;
            msg.className = `message ${sender}`;
            msg.innerText = text;
            chatContainer.appendChild(msg);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            return id;
        }

        sendBtn.addEventListener('click', handleSubmit);
        promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
            }
        });

        promptInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight - 16) + 'px';
        });
    </script>
</body>
</html>
