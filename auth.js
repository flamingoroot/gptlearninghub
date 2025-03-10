/**
 * Authentication and security management for the chatbot admin panel
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showLoginModal();
    } else {
        hideLoginModal();
    }
    
    // Initialize login form
    initLoginForm();
    
    // Initialize forgot password functionality
    initForgotPassword();
});

/**
 * Check if the user is logged in
 */
function isLoggedIn() {
    const authToken = localStorage.getItem('authToken');
    return !!authToken;
}

/**
 * Initialize login form
 */
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('remember-me').checked;
        
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        // In a real application, this would send a request to authenticate
        authenticateUser(username, password, rememberMe);
    });
    
    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgot-password');
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotPasswordModal();
    });
}

/**
 * Authenticate user
 */
function authenticateUser(username, password, rememberMe) {
    // Updated credentials to use demo/gptlearninghub instead of admin/admin123
    if (username === 'demo' && password === 'gptlearninghub') {
        // Generate a mock token
        const token = generateMockToken();
        
        // Store auth data
        localStorage.setItem('authToken', token);
        localStorage.setItem('userName', username);
        
        if (rememberMe) {
            // Set token with longer expiry
            localStorage.setItem('tokenExpiry', Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days
        } else {
            // Set token with session expiry
            localStorage.setItem('tokenExpiry', Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
        }
        
        // Hide login modal
        hideLoginModal();
    } else {
        alert('Invalid username or password');
    }
}

/**
 * Generate a mock token for demo purposes
 */
function generateMockToken() {
    return 'auth_token_' + Math.random().toString(36).substring(2, 15);
}

/**
 * Show login modal
 */
function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.style.display = 'flex';
}

/**
 * Hide login modal
 */
function hideLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.style.display = 'none';
}

/**
 * Initialize forgot password functionality
 */
function initForgotPassword() {
    // Security questions (in a real app, these would be stored securely and fetched from server)
    const securityQuestions = [
        {
            id: 1,
            question: 'What was the name of your first pet?',
            answer: 'fluffy' // In real app, this would be hashed and securely stored
        },
        {
            id: 2,
            question: 'What was the first street you lived on?',
            answer: 'maple' // In real app, this would be hashed and securely stored
        },
        {
            id: 3,
            question: 'What was the name of your elementary school?',
            answer: 'lincoln' // In real app, this would be hashed and securely stored
        },
        {
            id: 4,
            question: 'What was your childhood nickname?',
            answer: 'buddy' // In real app, this would be hashed and securely stored
        },
        {
            id: 5,
            question: 'What is your mother\'s maiden name?',
            answer: 'smith' // In real app, this would be hashed and securely stored
        }
    ];
    
    const closeModalBtn = document.getElementById('close-forgot-modal');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const securityQuestionsContainer = document.getElementById('security-questions-container');
    const resetPasswordForm = document.getElementById('reset-password-form');
    
    // Make sure forgot password modal is hidden by default
    forgotPasswordModal.style.display = 'none';
    
    closeModalBtn.addEventListener('click', () => {
        forgotPasswordModal.style.display = 'none';
    });
    
    // When the forgot password link is clicked, populate security questions
    document.getElementById('forgot-password').addEventListener('click', () => {
        populateSecurityQuestions(securityQuestionsContainer, securityQuestions);
    });
    
    // Handle security questions form submission
    securityQuestionsContainer.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In real app, we would verify all questions
        // For demo, just check the first one
        const questionId = e.target.getAttribute('data-question-id');
        const answer = document.getElementById(`security-answer-${questionId}`).value.trim().toLowerCase();
        
        const question = securityQuestions.find(q => q.id == questionId);
        
        if (question && answer === question.answer) {
            // If answer is correct, show password reset form
            securityQuestionsContainer.classList.add('hidden');
            resetPasswordForm.classList.remove('hidden');
        } else {
            alert('Incorrect answer. Please try again.');
        }
    });
    
    // Handle password reset form
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('new-reset-password').value;
        const confirmPassword = document.getElementById('confirm-reset-password').value;
        
        if (!newPassword || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // In a real application, this would send a request to reset the password
        alert('Password has been reset successfully! You can now login with your new password.');
        
        // Hide the modal and reset the form
        forgotPasswordModal.style.display = 'none';
        resetPasswordForm.classList.add('hidden');
        securityQuestionsContainer.classList.remove('hidden');
        resetPasswordForm.reset();
    });
}

/**
 * Show forgot password modal
 */
function showForgotPasswordModal() {
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    forgotPasswordModal.style.display = 'flex';
}

/**
 * Populate security questions in the forgot password modal
 */
function populateSecurityQuestions(container, questions) {
    // For the demo, we'll just ask one random question for simplicity
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    
    container.innerHTML = `
        <form class="security-question-form" data-question-id="${question.id}">
            <div class="form-group">
                <label for="security-answer-${question.id}">${question.question}</label>
                <input type="text" id="security-answer-${question.id}" required>
            </div>
            <button type="submit" class="btn btn-primary">Verify Answer</button>
        </form>
    `;
}

/**
 * Check auth token expiry and logout if expired
 */
function checkTokenExpiry() {
    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry && parseInt(expiry) < Date.now()) {
        // Token expired, log out
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('tokenExpiry');
        
        showLoginModal();
    }
}

// Check token expiry periodically
setInterval(checkTokenExpiry, 60000); // Check every minute 