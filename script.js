document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chatWindow');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // --- Core Functions ---

    /**
     * Creates and appends a message element to the chat window.
     * @param {string} text - The message content.
     * @param {string} sender - 'user' or 'bot'.
     * @returns {HTMLElement} The created text content element.
     */
    function createMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.textContent = sender === 'bot' ? '🤖' : '👤';
        
        const textContent = document.createElement('div');
        textContent.classList.add('text-content');
        textContent.innerHTML = text; // Use innerHTML for text streaming

        messageDiv.appendChild(sender === 'bot' ? avatar : textContent);
        messageDiv.appendChild(sender === 'bot' ? textContent : avatar);

        // Ensure the initial-message class is removed before adding new messages
        const initialMessage = chatWindow.querySelector('.initial-message');
        if (initialMessage) {
            initialMessage.classList.remove('initial-message');
        }

        chatWindow.appendChild(messageDiv);
        scrollToBottom();
        return textContent;
    }

    /**
     * Simulates a human-like typing animation/streaming effect.
     * @param {HTMLElement} element - The text content element to stream into.
     * @param {string} fullText - The full response text.
     * @returns {Promise<void>} A promise that resolves when typing is complete.
     */
    function typeTextStream(element, fullText) {
        return new Promise(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < fullText.length) {
                    // Append the next character/word chunk
                    element.innerHTML += fullText.charAt(i);
                    i++;
                    scrollToBottom();
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 30); // Speed of typing (30ms per character)
        });
    }

    /**
     * Simple utility to scroll the chat window to the latest message.
     */
    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    
    // --- AI Simulation (Replace with actual API call) ---

    const botResponses = [
        "That is a great question! I'm currently processing a detailed and human-like response for you. Please allow me a moment to gather my thoughts.",
        "Based on my analysis, the best approach would be to first outline the core requirements. This ensures clarity and efficiency in the next steps.",
        "Indeed, the challenge lies not in the complexity of the code, but in the elegance of the implementation. I recommend focusing on clean separation of concerns.",
        "I'm designed to communicate naturally. Let me rephrase that using more conversational language: What you're asking for is totally doable, let's break it down!",
        "Thank you for the stimulating query. I appreciate the opportunity to stretch my linguistic muscles."
    ];

    function getBotResponse(userMessage) {
        // In a real app, this would be an async API call to your backend/AI model.
        // E.g., fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: userMessage }) })
        
        // For simulation, return a random response after a small delay.
        const randomIndex = Math.floor(Math.random() * botResponses.length);
        return botResponses[randomIndex];
    }

    /**
     * Handles the full send process:
     * 1. Get user input.
     * 2. Display user message.
     * 3. Show typing indicator.
     * 4. Fetch/Simulate bot response.
     * 5. Remove indicator and stream bot message.
     */
    async function handleSend() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        // 1. Clear input and reset height
        userInput.value = '';
        adjustInputHeight();

        // 2. Display user message
        createMessage(userMessage, 'user');

        // 3. Show typing indicator (Animation for responsiveness)
        const typingIndicatorDiv = document.createElement('div');
        typingIndicatorDiv.classList.add('message', 'bot-message', 'typing-message');
        typingIndicatorDiv.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="typing-indicator">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        chatWindow.appendChild(typingIndicatorDiv);
        scrollToBottom();

        // 4. Fetch/Simulate bot response
        const botResponseText = await new Promise(resolve => {
            setTimeout(() => {
                resolve(getBotResponse(userMessage));
            }, 1000); // Simulate network latency
        });

        // 5. Remove indicator and stream bot message
        chatWindow.removeChild(typingIndicatorDiv);
        const botTextContentElement = createMessage('', 'bot');
        await typeTextStream(botTextContentElement, botResponseText);
        
        // Optional: Re-enable button if disabled during processing
        sendBtn.disabled = false;
    }

    // --- UI/UX Enhancements ---

    /**
     * Auto-adjusts the height of the textarea based on content (smooth animation).
     */
    function adjustInputHeight() {
        // Temporarily reset height to calculate the true scrollHeight
        userInput.style.height = 'auto'; 
        const newHeight = Math.min(userInput.scrollHeight, 150); // Max height 150px
        userInput.style.height = `${newHeight}px`;
        // Ensure scroll to bottom of chat if the input area pushes the chat up
        scrollToBottom(); 
    }
    
    // Event listeners
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('input', adjustInputHeight);
    
    // Allow sending message with Enter key (but not Shift+Enter)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents newline
            handleSend();
        }
    });

    // Initial check for input height
    adjustInputHeight();
});
