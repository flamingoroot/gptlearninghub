// Chatbot Widget Implementation
class ChatbotWidget {
    constructor(options = {}) {
        this.apiEndpoint = options.apiEndpoint || '/api/chatbot';
        this.botName = options.botName || 'GPT Learning Hub Assistant';
        this.initialMessage = options.initialMessage || 'Hello! I\'m here to help with any questions about our courses. How can I assist you today?';
        this.position = options.position || 'bottom-right';
        this.theme = options.theme || 'light';
        this.messages = [];
        this.isOpen = false;
        this.isInitialized = false;
        
        // Check for saved settings in localStorage or API
        this.loadSettings();
        
        this.init();
        
        // Check for settings changes every 5 seconds
        setInterval(() => this.checkForSettingsChanges(), 5000);
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createWidgetHTML();
        this.bindEvents();
        this.addInitialMessage();
        
        this.isInitialized = true;
    }
    
    loadSettings() {
        // Try to load settings from API or localStorage
        if (window.chatbotAPI && typeof window.chatbotAPI.getChatbotSettings === 'function') {
            const settings = window.chatbotAPI.getChatbotSettings();
            this.updateSettings(settings);
        }
    }
    
    updateSettings(settings) {
        if (!settings) return;
        
        // Update widget properties
        if (settings.botName) this.botName = settings.botName;
        if (settings.welcomeMessage) this.initialMessage = settings.welcomeMessage;
        if (settings.position) this.position = settings.position;
        if (settings.theme) this.theme = settings.theme;
        
        // Update UI if widget is already created
        if (this.isInitialized) {
            // Update bot name in header
            const botNameEl = document.querySelector('.chatbot-title h3');
            if (botNameEl) botNameEl.textContent = this.botName;
            
            // Update position
            const container = document.getElementById('chatbot-container');
            const launcher = document.getElementById('chatbot-launcher');
            
            if (container && launcher) {
                // Remove old position classes
                container.classList.remove('bottom-right', 'bottom-left', 'top-right', 'top-left');
                launcher.classList.remove('bottom-right', 'bottom-left', 'top-right', 'top-left');
                
                // Add new position class
                container.classList.add(this.position);
                launcher.classList.add(this.position);
            }
            
            // Update theme
            if (container) {
                container.classList.remove('light', 'dark');
                container.classList.add(this.theme);
            }
        }
    }
    
    checkForSettingsChanges() {
        // Check for settings changes from API
        if (window.chatbotAPI && typeof window.chatbotAPI.getChatbotSettings === 'function') {
            const currentSettings = window.chatbotAPI.getChatbotSettings();
            
            // Check if settings have changed
            if (
                currentSettings.botName !== this.botName ||
                currentSettings.welcomeMessage !== this.initialMessage ||
                currentSettings.position !== this.position ||
                currentSettings.theme !== this.theme
            ) {
                this.updateSettings(currentSettings);
            }
        }
    }
    
    createWidgetHTML() {
        const chatHTML = `
            <div class="chatbot-container ${this.position} ${this.theme}" id="chatbot-container">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <h3>${this.botName}</h3>
                    </div>
                    <div class="chatbot-controls">
                        <button class="minimize-btn" id="chatbot-minimize-btn">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="close-btn" id="chatbot-close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="chatbot-body">
                    <div class="chatbot-messages" id="chatbot-messages"></div>
                </div>
                <div class="chatbot-footer">
                    <form id="chatbot-form">
                        <input 
                            type="text" 
                            id="chatbot-input" 
                            placeholder="Type your message here..." 
                            autocomplete="off"
                        >
                        <button type="submit" id="chatbot-submit">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
            <div class="chatbot-launcher ${this.position}" id="chatbot-launcher">
                <button class="launcher-button">
                    <i class="fas fa-comment"></i>
                </button>
            </div>
        `;
        
        const chatbotWrapper = document.createElement('div');
        chatbotWrapper.className = 'chatbot-wrapper';
        chatbotWrapper.innerHTML = chatHTML;
        document.body.appendChild(chatbotWrapper);
    }
    
    bindEvents() {
        const launcher = document.getElementById('chatbot-launcher');
        const container = document.getElementById('chatbot-container');
        const minimizeBtn = document.getElementById('chatbot-minimize-btn');
        const closeBtn = document.getElementById('chatbot-close-btn');
        const form = document.getElementById('chatbot-form');
        
        launcher.addEventListener('click', () => this.toggleChat(true));
        minimizeBtn.addEventListener('click', () => this.toggleChat(false));
        closeBtn.addEventListener('click', () => this.toggleChat(false));
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('chatbot-input');
            const message = input.value.trim();
            
            if (message) {
                this.addUserMessage(message);
                input.value = '';
                this.processUserMessage(message);
            }
        });
    }
    
    toggleChat(open) {
        const launcher = document.getElementById('chatbot-launcher');
        const container = document.getElementById('chatbot-container');
        
        this.isOpen = open !== undefined ? open : !this.isOpen;
        
        if (this.isOpen) {
            container.classList.add('open');
            launcher.classList.add('hidden');
        } else {
            container.classList.remove('open');
            launcher.classList.remove('hidden');
        }
    }
    
    addInitialMessage() {
        this.addBotMessage(this.initialMessage);
    }
    
    addUserMessage(text) {
        const message = {
            sender: 'user',
            text,
            timestamp: new Date()
        };
        
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }
    
    addBotMessage(text) {
        const message = {
            sender: 'bot',
            text,
            timestamp: new Date()
        };
        
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }
    
    renderMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${message.sender}-message`;
        
        const timestampStr = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${message.text}</p>
                <span class="message-timestamp">${timestampStr}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    async processUserMessage(message) {
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Use the mock chatbot API directly instead of fetch
            if (window.chatbotAPI && typeof window.chatbotAPI.processMessage === 'function') {
                const data = await window.chatbotAPI.processMessage(message, this.messages);
                
                // Remove typing indicator
                this.hideTypingIndicator();
                
                // Add bot response
                this.addBotMessage(data.response);
            } else {
                // Fallback if API is not available
                setTimeout(() => {
                    this.hideTypingIndicator();
                    this.addBotMessage("I'm here to help with any questions about our courses. Please ask me anything!");
                }, 1000);
            }
        } catch (error) {
            console.error('Error communicating with chatbot API:', error);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Show friendly error message
            this.addBotMessage('I seem to be having trouble connecting to my knowledge base. Let me try a simple response instead.');
            
            // Add a fallback response
            setTimeout(() => {
                this.addBotMessage("I can help with information about our courses, pricing, enrollment, and more. What would you like to know?");
            }, 1000);
        }
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingIndicator);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotWidget = new ChatbotWidget({
        botName: 'GPT Learning Hub Assistant',
        initialMessage: 'Hello! I\'m your AI assistant. How can I help you with our courses today?',
        position: 'bottom-right',
        theme: 'light'
    });
}); 