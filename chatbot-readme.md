# Chatbot System for GPT Learning Hub

This repository contains a complete chatbot system for the GPT Learning Hub website, consisting of a user-facing chat widget and an admin panel for training and managing the chatbot.

## Features

### User-Facing Chatbot Widget
- Appears in the corner of the main website
- Collapsible interface with minimize/close controls
- Typing indicators for a more natural conversation feel
- Message history with timestamps
- Light/dark theme support
- Responsive design for all devices

### Admin Panel
- Secure login with password protection
- Password recovery with security questions
- Dashboard with performance metrics and analytics
- Multiple training methods:
  - Document upload (PDF, DOCX, TXT, CSV, JSON)
  - Web URL crawling
  - Direct knowledge input
  - Q&A pair creation
- Conversation history and analytics
- Customizable responses:
  - Canned responses for common questions
  - Fallback responses for unknown queries
  - Greeting messages
- Advanced settings customization:
  - Chatbot appearance
  - Behavior settings
  - AI model selection
  - Response temperature controls

## File Structure

- `chatbot.js` - Frontend implementation of the chat widget
- `chatbot.css` - Styling for the chat widget
- `chatbot-api.js` - Backend logic for processing messages (client-side mock)
- `admin-panel.html` - Admin interface for chatbot management
- `admin-panel.js` - JavaScript for admin panel functionality
- `admin-panel.css` - Styling for the admin panel
- `auth.js` - Authentication and security for the admin panel

## Installation

1. Include the CSS and JavaScript files in your HTML document:

```html
<!-- In the <head> section -->
<link rel="stylesheet" href="chatbot.css">

<!-- Before the closing </body> tag -->
<script src="chatbot-api.js"></script>
<script src="chatbot.js"></script>
```

2. Access the admin panel by navigating to `admin-panel.html`.

## Admin Panel Access

Default login credentials:
- Username: `demo`
- Password: `gptlearninghub`

For security reasons, please change these credentials after first login.

## Training the Chatbot

The chatbot can be trained using several methods:

### Document Upload
Upload documents in various formats (PDF, DOCX, TXT, CSV, JSON) that contain knowledge the chatbot should learn.

### Web URLs
Provide URLs to web pages containing relevant information. The system will crawl and extract content from these pages.

### Direct Knowledge Input
Enter knowledge directly into the system with title, content, and tags to help categorize the information.

### Q&A Pairs
Create specific question and answer pairs for common queries to ensure accurate responses.

## Security Features

- Password-protected admin access
- 5 customizable security questions for password recovery
- Session timeout controls
- Optional two-factor authentication
- Login notifications
- IP restriction capabilities

## Customization

The chatbot appearance and behavior can be extensively customized through the admin panel settings:

- Name and welcome message
- Position on the page
- Theme (light/dark)
- Automatic opening behavior
- Response timing
- AI model selection
- Response temperature (creativity vs. precision)

## Implementation Notes

This implementation uses client-side JavaScript to simulate backend functionality for demonstration purposes. In a production environment, you would:

1. Implement a proper backend API using Node.js, Python, or another server technology
2. Store data in a database rather than in-memory storage
3. Implement proper security measures for authentication
4. Use actual AI models like GPT for response generation
5. Set up proper document parsing for different file types

## License

This code is provided for educational purposes and can be used as a starting point for implementing a chatbot system in your own projects.

## Support

For questions or assistance, please contact the development team at support@gptlearninghub.com. 