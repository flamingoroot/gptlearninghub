/**
 * Chatbot API - Server-side implementation
 * 
 * In a real application, this would be a server-side implementation.
 * For demo purposes, we're implementing a browser-based mockup that simulates
 * server responses.
 */

// Mock training data storage
let knowledgeBase = [];
let qaPairs = [];
let responses = {
    canned: [],
    fallback: [
        "I'm sorry, I don't understand. Could you rephrase your question?",
        "I'm not sure I understand. Could you try asking in a different way?",
        "I'm still learning. Could you please clarify what you're asking about?"
    ],
    greeting: [
        "Hello! How can I assist you today?",
        "Hi there! Welcome to GPT Learning Hub. What can I help you with?",
        "Welcome! I'm your AI assistant. How may I help you today?"
    ]
};

// Mock conversation history
let conversations = [];

// Mock user data
let users = [];

// Chatbot settings
let settings = {
    botName: "GPT Learning Hub Assistant",
    welcomeMessage: "Hello! I'm here to help with any questions about our courses. How can I assist you today?",
    position: "bottom-right",
    theme: "light",
    autoOpen: true,
    showTyping: true,
    collectFeedback: true,
    responseDelay: 800,
    inactiveTimeout: 30,
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: "You are an AI assistant for GPT Learning Hub, an online learning platform for AI and machine learning courses. Answer questions helpfully, accurately, and concisely. If you don't know the answer, say so and offer to connect the user with a human representative."
};

/**
 * Initialize the chatbot API
 */
function initChatbotAPI() {
    // Load saved data from localStorage if available
    loadFromLocalStorage();
    
    // Set up mock documents if none exist
    if (knowledgeBase.length === 0 && qaPairs.length === 0) {
        initMockData();
    }
    
    // Expose the chatbot API
    window.chatbotAPI = {
        processMessage,
        addQAPair,
        addKnowledge,
        addUrlContent,
        addDocument,
        updateSettings,
        getChatbotSettings: () => settings,
        getConversations: () => conversations,
        getStats: getStats
    };
}

/**
 * Load data from localStorage if available
 */
function loadFromLocalStorage() {
    try {
        // Load knowledge base
        const savedKnowledgeBase = localStorage.getItem('chatbot_knowledgeBase');
        if (savedKnowledgeBase) {
            knowledgeBase = JSON.parse(savedKnowledgeBase);
        }
        
        // Load Q&A pairs
        const savedQAPairs = localStorage.getItem('chatbot_qaPairs');
        if (savedQAPairs) {
            qaPairs = JSON.parse(savedQAPairs);
        }
        
        // Load responses
        const savedResponses = localStorage.getItem('chatbot_responses');
        if (savedResponses) {
            responses = JSON.parse(savedResponses);
        }
        
        // Load conversations
        const savedConversations = localStorage.getItem('chatbot_conversations');
        if (savedConversations) {
            conversations = JSON.parse(savedConversations);
        }
        
        // Load settings
        const savedSettings = localStorage.getItem('chatbot_settings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
    }
}

/**
 * Save data to localStorage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem('chatbot_knowledgeBase', JSON.stringify(knowledgeBase));
        localStorage.setItem('chatbot_qaPairs', JSON.stringify(qaPairs));
        localStorage.setItem('chatbot_responses', JSON.stringify(responses));
        localStorage.setItem('chatbot_conversations', JSON.stringify(conversations));
        localStorage.setItem('chatbot_settings', JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
    }
}

/**
 * Initialize mock data for demonstration
 */
function initMockData() {
    // Add some sample knowledge
    knowledgeBase = [
        {
            id: 1,
            title: "Course Registration Process",
            content: "To register for a course, log in to your account, browse our course catalog, select the desired course, and click 'Enroll Now'. Follow the payment instructions to complete your registration. If you encounter any issues, please contact our support team.",
            tags: "courses, registration, enrollment, payment",
            dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
            id: 2,
            title: "Course Pricing",
            content: "Our courses are priced based on content depth, duration, and whether they include personalized feedback from instructors. Basic courses start at $49, intermediate courses at $99, and advanced courses at $199. We also offer subscription plans starting at $29/month for access to multiple courses.",
            tags: "pricing, costs, subscription, payment",
            dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
    ];
    
    // Add some sample Q&A pairs
    qaPairs = [
        {
            id: 1,
            question: "How do I enroll in a course?",
            answer: "To enroll in a course, navigate to our course catalog, select the desired course, and click the 'Enroll Now' button. You'll be guided through the payment process to complete your enrollment.",
            tags: "enrollment, courses",
            dateAdded: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        },
        {
            id: 2,
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and bank transfers for course payments. For corporate enrollments, we also offer invoice payment options.",
            tags: "payment, billing",
            dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
            id: 3,
            question: "Are there any prerequisites for advanced courses?",
            answer: "Yes, most advanced courses have prerequisites to ensure students have the necessary foundational knowledge. Prerequisites are listed on each course page. If you're unsure whether you meet the requirements, feel free to contact our support team for guidance.",
            tags: "courses, prerequisites, requirements",
            dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
    ];
    
    // Add some sample canned responses
    responses.canned = [
        {
            id: 1,
            name: "pricing_inquiry",
            triggers: "price, cost, payment, how much",
            content: "Our courses range from $49 to $199 depending on the complexity and depth of the material. We also offer subscription plans starting at $29/month. You can find detailed pricing information on each course page."
        },
        {
            id: 2,
            name: "refund_policy",
            triggers: "refund, money back, cancel, cancellation",
            content: "We offer a 30-day money-back guarantee for all our courses. If you're not satisfied with the course content, you can request a full refund within 30 days of purchase through your account dashboard or by contacting support."
        }
    ];
    
    // Save the initial data to localStorage
    saveToLocalStorage();
}

/**
 * Process a user message and generate a response
 */
async function processMessage(message, history) {
    const delay = settings.responseDelay || 800;
    
    // Simulate processing delay
    return new Promise(resolve => {
        setTimeout(() => {
            const response = generateResponse(message, history);
            
            // Record conversation
            recordConversation(message, response);
            
            resolve({ response });
        }, delay);
    });
}

/**
 * Generate a response based on user input
 */
function generateResponse(message, history) {
    // Check for canned responses first
    const cannedResponse = findCannedResponse(message);
    if (cannedResponse) {
        return cannedResponse;
    }
    
    // Check for exact matches in Q&A pairs
    const qaMatch = findQAPairMatch(message);
    if (qaMatch) {
        return qaMatch;
    }
    
    // Check for knowledge base matches
    const knowledgeMatch = findKnowledgeMatch(message);
    if (knowledgeMatch) {
        return knowledgeMatch;
    }
    
    // If no matches, return a random fallback response
    return getRandomFallbackResponse();
}

/**
 * Find matching canned response based on triggers
 */
function findCannedResponse(message) {
    const messageLower = message.toLowerCase();
    
    for (const response of responses.canned) {
        const triggers = response.triggers.split(',').map(t => t.trim().toLowerCase());
        
        // Check if message contains any of the triggers
        if (triggers.some(trigger => messageLower.includes(trigger))) {
            return response.content;
        }
    }
    
    return null;
}

/**
 * Find matching Q&A pair
 */
function findQAPairMatch(message) {
    const messageLower = message.toLowerCase();
    
    // Simple approach: check if message contains the question keywords
    for (const pair of qaPairs) {
        const questionWords = pair.question.toLowerCase().split(' ');
        const messageWords = messageLower.split(' ');
        
        // Count matching words
        const matchingWords = questionWords.filter(word => 
            word.length > 3 && messageWords.includes(word)
        );
        
        // If more than 60% of significant words match, return the answer
        if (matchingWords.length >= Math.floor(questionWords.filter(w => w.length > 3).length * 0.6)) {
            return pair.answer;
        }
    }
    
    return null;
}

/**
 * Find matching knowledge base content
 */
function findKnowledgeMatch(message) {
    const messageLower = message.toLowerCase();
    
    // Search for relevant content in knowledge base
    for (const entry of knowledgeBase) {
        const titleLower = entry.title.toLowerCase();
        const contentLower = entry.content.toLowerCase();
        const tagsLower = entry.tags ? entry.tags.toLowerCase() : '';
        
        // Check if message keywords match title, content, or tags
        if (
            containsKeywords(titleLower, messageLower) ||
            containsKeywords(contentLower, messageLower) ||
            containsKeywords(tagsLower, messageLower)
        ) {
            // Return a relevant excerpt
            return extractRelevantContent(entry.content, messageLower);
        }
    }
    
    return null;
}

/**
 * Check if text contains keywords from query
 */
function containsKeywords(text, query) {
    const queryWords = query.split(' ').filter(word => word.length > 3);
    
    // Check if text contains at least half of the query words
    let matchCount = 0;
    for (const word of queryWords) {
        if (text.includes(word)) {
            matchCount++;
        }
    }
    
    return matchCount >= Math.ceil(queryWords.length / 2);
}

/**
 * Extract the most relevant part of the content
 */
function extractRelevantContent(content, query) {
    // In a real implementation, this would use more sophisticated techniques
    // For this demo, we'll just return the full content
    return content;
}

/**
 * Get a random fallback response
 */
function getRandomFallbackResponse() {
    const index = Math.floor(Math.random() * responses.fallback.length);
    return responses.fallback[index];
}

/**
 * Record a conversation for analytics
 */
function recordConversation(message, response) {
    // In a real implementation, this would store the conversation in a database
    const conversation = {
        id: Date.now(),
        timestamp: new Date(),
        userMessage: message,
        botResponse: response,
        user: "anonymous", // In a real app, this would be the user ID or session ID
        duration: 0, // This would be calculated based on session length
        feedback: null // This would be populated if the user provides feedback
    };
    
    conversations.push(conversation);
    
    // Keep only the most recent 1000 conversations for the demo
    if (conversations.length > 1000) {
        conversations.shift();
    }
    
    // Save conversations to localStorage
    saveToLocalStorage();
}

/**
 * Add a new Q&A pair to the knowledge base
 */
function addQAPair(question, answer, tags) {
    const newPair = {
        id: Date.now(),
        question,
        answer,
        tags,
        dateAdded: new Date()
    };
    
    qaPairs.push(newPair);
    
    // Save to localStorage
    saveToLocalStorage();
    
    return newPair;
}

/**
 * Add knowledge to the knowledge base
 */
function addKnowledge(title, content, tags) {
    const newKnowledge = {
        id: Date.now(),
        title,
        content,
        tags,
        dateAdded: new Date()
    };
    
    knowledgeBase.push(newKnowledge);
    
    // Save to localStorage
    saveToLocalStorage();
    
    return newKnowledge;
}

/**
 * Add content from a URL to the knowledge base
 */
function addUrlContent(url, content) {
    // In a real implementation, this would extract content from the URL
    // For this demo, we'll assume the content is provided
    const newKnowledge = addKnowledge(`Content from ${url}`, content, url);
    
    // Save to localStorage
    saveToLocalStorage();
    
    return newKnowledge;
}

/**
 * Add document to the knowledge base
 */
function addDocument(filename, content, type) {
    // In a real implementation, this would parse the document based on its type
    // For this demo, we'll assume the content is provided
    const newKnowledge = addKnowledge(`Document: ${filename}`, content, type);
    
    // Save to localStorage
    saveToLocalStorage();
    
    return newKnowledge;
}

/**
 * Update chatbot settings
 */
function updateSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    
    // Save settings to localStorage
    saveToLocalStorage();
    
    return settings;
}

/**
 * Get chatbot statistics
 */
function getStats() {
    // Calculate actual stats from data
    const uniqueUsers = new Set(conversations.map(c => c.user)).size;
    
    return {
        totalConversations: conversations.length,
        uniqueUsers,
        documents: knowledgeBase.length + qaPairs.length,
        satisfactionRate: calculateSatisfactionRate(),
        popularTopics: getPopularTopics()
    };
}

/**
 * Calculate satisfaction rate from feedback
 */
function calculateSatisfactionRate() {
    // In a real implementation, this would calculate based on actual feedback
    // For this demo, we'll return a value based on conversation count
    // More conversations = higher satisfaction (just for demo purposes)
    const baseRate = 85;
    const conversationBonus = Math.min(conversations.length / 10, 10);
    return Math.round(baseRate + conversationBonus);
}

/**
 * Get popular topics from conversations
 */
function getPopularTopics() {
    // In a real implementation, this would analyze conversation content
    // For this demo, we'll generate topics based on existing data
    const topics = [
        { topic: "Pricing", count: 0 },
        { topic: "Course Content", count: 0 },
        { topic: "Enrollment", count: 0 },
        { topic: "Technical Issues", count: 0 },
        { topic: "Certificates", count: 0 }
    ];
    
    // Count mentions of each topic in conversations
    conversations.forEach(convo => {
        const message = convo.userMessage.toLowerCase();
        
        if (message.includes("price") || message.includes("cost") || message.includes("payment")) {
            topics[0].count++;
        }
        
        if (message.includes("course") || message.includes("content") || message.includes("learn")) {
            topics[1].count++;
        }
        
        if (message.includes("enroll") || message.includes("register") || message.includes("sign up")) {
            topics[2].count++;
        }
        
        if (message.includes("error") || message.includes("problem") || message.includes("issue")) {
            topics[3].count++;
        }
        
        if (message.includes("certificate") || message.includes("completion") || message.includes("diploma")) {
            topics[4].count++;
        }
    });
    
    // Sort topics by count
    return topics.sort((a, b) => b.count - a.count);
}

// Initialize the API when the script is loaded
initChatbotAPI(); 