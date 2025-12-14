const chat = document.getElementById('chat');


sendBtn.onclick = sendMessage;
input.addEventListener('keypress', e => {
if (e.key === 'Enter') sendMessage();
});


function sendMessage() {
const text = input.value.trim();
if (!text) return;


addMessage(text, 'user');
input.value = '';


setTimeout(() => {
botReply(text);
}, 600);
}


function addMessage(text, sender) {
const msg = document.createElement('div');
msg.className = `message ${sender}`;
msg.innerText = text;
chat.appendChild(msg);
chat.scrollTop = chat.scrollHeight;
}


function botReply(userText) {
const replies = [
"That's a great question!",
"Let me think about that...",
"Here's a simple explanation:",
"Interesting! Here's what I know:",
"Sure! Let me help you with that."
];


const reply = replies[Math.floor(Math.random() * replies.length)] +
" \n\n(This is a frontend AI demo)";


typeMessage(reply);
}


function typeMessage(text) {
const msg = document.createElement('div');
msg.className = 'message bot';
chat.appendChild(msg);


let i = 0;
const typing = setInterval(() => {
msg.innerText += text.charAt(i);
i++;
chat.scrollTop = chat.scrollHeight;
if (i >= text.length) clearInterval(typing);
}, 25);
}