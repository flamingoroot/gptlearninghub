document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI state
    initAdminPanel();
    
    // Load dashboard data
    initDashboardStats();
});

/**
 * Initialize the admin panel UI
 */
function initAdminPanel() {
    // Navigation 
    initNavigation();
    
    // Tabs
    initTabs();
    
    // Toggle sidebar on mobile
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('mobile-visible');
        mainContent.classList.toggle('expanded');
    });
    
    // Document Upload
    initDocumentUpload();
    
    // URL Training
    initURLTraining();
    
    // Knowledge Base
    initKnowledgeForm();
    
    // Q&A Pairs
    initQAForm();
    
    // Canned Responses
    initCannedResponses();
    
    // Fallback Responses
    initFallbackResponses();
    
    // Greeting Responses
    initGreetingResponses();
    
    // Settings
    initSettings();
    
    // Security
    initSecurity();
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', handleLogout);
}

/**
 * Initialize the sidebar navigation
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active navigation item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Show the corresponding content section
            const targetId = item.getAttribute('data-target');
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            
            // Update page title
            pageTitle.textContent = item.querySelector('span').textContent;
            
            // Refresh data if dashboard is selected
            if (targetId === 'dashboard') {
                initDashboardStats();
            }
        });
    });
}

/**
 * Initialize tab functionality within sections
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabsContainer = button.closest('.tab-buttons');
            const contentContainer = tabsContainer.nextElementSibling;
            const tabId = button.getAttribute('data-tab');
            
            // Update active tab button
            tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Show the corresponding tab content
            contentContainer.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Initialize document upload functionality
 */
function initDocumentUpload() {
    const dropzone = document.querySelector('.dropzone');
    const fileInput = document.getElementById('file-upload');
    const browseBtn = document.querySelector('.btn-browse');
    const processBtn = document.querySelector('.btn-process-docs');
    const saveBtn = document.createElement('button');
    
    // Add save button
    saveBtn.className = 'btn btn-primary btn-save-docs';
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Training Data';
    saveBtn.disabled = true;
    processBtn.parentElement.appendChild(saveBtn);
    
    // When "Browse" button is clicked, trigger file input
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // When files are selected via file input
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    // Dropzone click to select files
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Dropzone drag and drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // Process files button
    processBtn.addEventListener('click', () => {
        processDocuments();
    });
    
    // Save button click handler
    saveBtn.addEventListener('click', () => {
        saveDocuments();
    });
    
    function updateDocumentListState() {
        const files = document.querySelectorAll('.files-table tbody tr:not(.empty-table)');
        const completedFiles = document.querySelectorAll('.files-table tbody td.status.completed');
        
        // Update save button state
        saveBtn.disabled = completedFiles.length === 0;
        
        // Update process button state
        processBtn.disabled = files.length === 0;
        
        // Show empty table message if no files
        const filesTable = document.querySelector('.files-table tbody');
        if (files.length === 0) {
            filesTable.innerHTML = '<tr class="empty-table"><td colspan="4">No documents uploaded</td></tr>';
        }
    }
}

/**
 * Handle files selected for upload
 */
function handleFiles(files) {
    if (files.length === 0) return;
    
    const filesTable = document.querySelector('.files-table tbody');
    
    // Clear the "No documents uploaded" row if it exists
    if (filesTable.querySelector('.empty-table')) {
        filesTable.innerHTML = '';
    }
    
    Array.from(files).forEach(file => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${file.name}</td>
            <td>${formatFileSize(file.size)}</td>
            <td class="status pending">Pending</td>
            <td class="actions">
                <div class="progress-bar" style="display: none;">
                    <div class="progress" style="width: 0%">0%</div>
                </div>
                <button class="btn-delete" title="Remove"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Store file reference
        row.dataset.file = file.name;
        
        // Add delete functionality
        row.querySelector('.btn-delete').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // If file is being processed, ask for confirmation
            const status = row.querySelector('.status').textContent;
            if (status === 'Processing') {
                if (!confirm('This file is currently being processed. Are you sure you want to remove it?')) {
                    return;
                }
            }
            
            // Remove the file row
            row.remove();
            
            // Update document list state
            updateDocumentListState();
        });
        
        filesTable.appendChild(row);
    });
    
    updateDocumentListState();
}

/**
 * Process uploaded documents
 */
async function processDocuments() {
    const rows = document.querySelectorAll('.files-table tbody tr:not(.empty-table)');
    if (rows.length === 0) {
        alert('Please upload at least one document');
        return;
    }
    
    // Disable buttons during processing
    const processBtn = document.querySelector('.btn-process-docs');
    const saveBtn = document.querySelector('.btn-save-docs');
    const browseBtn = document.querySelector('.btn-browse');
    processBtn.disabled = true;
    saveBtn.disabled = true;
    browseBtn.disabled = true;
    
    let completedCount = 0;
    let hasError = false;
    
    // Process each file
    for (const row of rows) {
        const statusCell = row.querySelector('.status');
        // Skip already completed or errored files
        if (statusCell.classList.contains('completed') || statusCell.classList.contains('error')) {
            continue;
        }
        
        const fileName = row.dataset.file;
        const progressBar = row.querySelector('.progress-bar');
        const progressDiv = row.querySelector('.progress');
        const actionsCell = row.querySelector('.actions');
        
        // Show progress bar and hide delete button
        progressBar.style.display = 'block';
        row.querySelector('.btn-delete').style.display = 'none';
        
        // Update status
        statusCell.textContent = 'Processing';
        statusCell.className = 'status processing';
        
        try {
            // Simulate processing progress
            for (let progress = 0; progress <= 100; progress += 10) {
                await new Promise(resolve => setTimeout(resolve, 300));
                progressDiv.style.width = `${progress}%`;
                progressDiv.textContent = `${progress}%`;
            }
            
            // Mark as completed
            statusCell.textContent = 'Completed';
            statusCell.className = 'status completed';
            completedCount++;
            
            // Show delete button again
            row.querySelector('.btn-delete').style.display = 'block';
            
        } catch (error) {
            console.error(`Error processing ${fileName}:`, error);
            statusCell.textContent = 'Error';
            statusCell.className = 'status error';
            progressBar.style.display = 'none';
            row.querySelector('.btn-delete').style.display = 'block';
            hasError = true;
        }
    }
    
    // Re-enable buttons
    processBtn.disabled = false;
    browseBtn.disabled = false;
    saveBtn.disabled = completedCount === 0;
    
    // Show completion message
    if (completedCount > 0) {
        alert(`Processing completed! ${completedCount} document${completedCount > 1 ? 's' : ''} processed successfully.${hasError ? '\nSome documents encountered errors.' : ''}`);
    } else {
        alert('Processing completed with errors. Please check the status of each document.');
    }
    
    updateDocumentListState();
}

/**
 * Save processed documents
 */
function saveDocuments() {
    const completedFiles = Array.from(document.querySelectorAll('.files-table tbody tr')).filter(row => 
        row.querySelector('.status.completed')
    ).map(row => row.dataset.file);
    
    if (completedFiles.length === 0) {
        alert('No completed documents to save');
        return;
    }
    
    // Save to API if available
    if (window.chatbotAPI && typeof window.chatbotAPI.addDocument === 'function') {
        completedFiles.forEach(fileName => {
            window.chatbotAPI.addDocument(fileName, `Content processed from ${fileName}`, 'document');
        });
    }
    
    alert('Training data saved successfully!');
    
    // Clear the table
    const filesTable = document.querySelector('.files-table tbody');
    filesTable.innerHTML = '<tr class="empty-table"><td colspan="4">No documents uploaded</td></tr>';
    
    // Update button states
    const saveBtn = document.querySelector('.btn-save-docs');
    const processBtn = document.querySelector('.btn-process-docs');
    const browseBtn = document.querySelector('.btn-browse');
    saveBtn.disabled = true;
    processBtn.disabled = true;
    browseBtn.disabled = false;
}

/**
 * Format file size into human-readable format
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Initialize URL training functionality
 */
function initURLTraining() {
    const urlForm = document.querySelector('.url-form');
    const urlInput = document.getElementById('url-input');
    const urlsList = document.querySelector('.urls-table');
    const addUrlBtn = document.querySelector('.btn-add-url');
    const crawlBtn = document.querySelector('.btn-crawl-urls');
    const saveBtn = document.createElement('button');
    
    // Add save button
    saveBtn.className = 'btn btn-primary btn-save-urls';
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Training Data';
    saveBtn.disabled = true;
    crawlBtn.parentElement.appendChild(saveBtn);
    
    // Add URL button
    addUrlBtn.addEventListener('click', () => {
        addURL();
    });
    
    // Form submission
    urlForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addURL();
    });
    
    // Process URLs button
    crawlBtn.addEventListener('click', () => {
        startCrawling();
    });
    
    // Save button click handler
    saveBtn.addEventListener('click', () => {
        saveTrainingData();
    });
    
    function updateUrlListState() {
        const urls = urlsList.querySelectorAll('li:not(.empty-list)');
        const completedUrls = urlsList.querySelectorAll('.url-status.completed');
        
        // Update save button state
        saveBtn.disabled = completedUrls.length === 0;
        
        // Update crawl button state
        crawlBtn.disabled = urls.length === 0;
        
        // Show empty list message if no URLs
        if (urls.length === 0) {
            urlsList.innerHTML = '<li class="empty-list">No URLs added</li>';
        }
    }
    
    function addURL() {
        const url = urlInput.value.trim();
        
        if (!url) return;
        
        // Validate URL
        if (!isValidURL(url)) {
            alert('Please enter a valid URL');
            return;
        }
        
        // Clear the "No URLs added" message if it exists
        if (urlsList.querySelector('.empty-list')) {
            urlsList.innerHTML = '';
        }
        
        // Create URL item
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="url-item">
                <span class="url-text">${url}</span>
                <span class="url-status pending">Pending</span>
                <div class="progress-bar" style="display: none;">
                    <div class="progress" style="width: 0%">0%</div>
                </div>
                <button class="btn-delete" title="Remove"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add delete functionality
        li.querySelector('.btn-delete').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // If URL is being crawled, ask for confirmation
            const status = li.querySelector('.url-status').textContent;
            if (status === 'Crawling') {
                if (!confirm('This URL is currently being crawled. Are you sure you want to remove it?')) {
                    return;
                }
            }
            
            // Remove the URL item
            li.remove();
            
            // Update URL list state
            updateUrlListState();
        });
        
        urlsList.appendChild(li);
        updateUrlListState();
        
        // Clear input
        urlInput.value = '';
    }
    
    async function startCrawling() {
        const urls = urlsList.querySelectorAll('li:not(.empty-list)');
        if (urls.length === 0) {
            alert('Please add at least one URL to crawl');
            return;
        }
        
        // Disable buttons during crawling
        crawlBtn.disabled = true;
        addUrlBtn.disabled = true;
        saveBtn.disabled = true;
        
        let completedCount = 0;
        let hasError = false;
        
        // Process each URL
        for (const urlItem of urls) {
            const statusSpan = urlItem.querySelector('.url-status');
            // Skip already completed or errored URLs
            if (statusSpan.classList.contains('completed') || statusSpan.classList.contains('error')) {
                continue;
            }
            
            const urlText = urlItem.querySelector('.url-text').textContent;
            const progressBar = urlItem.querySelector('.progress-bar');
            const progressDiv = urlItem.querySelector('.progress');
            
            // Show progress bar
            progressBar.style.display = 'block';
            statusSpan.textContent = 'Crawling';
            statusSpan.className = 'url-status crawling';
            
            try {
                // Simulate crawling progress
                for (let progress = 0; progress <= 100; progress += 10) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    progressDiv.style.width = `${progress}%`;
                    progressDiv.textContent = `${progress}%`;
                }
                
                // Mark as completed
                statusSpan.textContent = 'Completed';
                statusSpan.className = 'url-status completed';
                completedCount++;
                
            } catch (error) {
                console.error(`Error crawling ${urlText}:`, error);
                statusSpan.textContent = 'Error';
                statusSpan.className = 'url-status error';
                progressBar.style.display = 'none';
                hasError = true;
            }
        }
        
        // Re-enable buttons
        crawlBtn.disabled = false;
        addUrlBtn.disabled = false;
        saveBtn.disabled = completedCount === 0;
        
        // Show completion message
        if (completedCount > 0) {
            alert(`Crawling completed! ${completedCount} URL${completedCount > 1 ? 's' : ''} processed successfully.${hasError ? '\nSome URLs encountered errors.' : ''}`);
        } else {
            alert('Crawling completed with errors. Please check the status of each URL.');
        }
        
        updateUrlListState();
    }
    
    function saveTrainingData() {
        const completedUrls = Array.from(urlsList.querySelectorAll('li')).filter(li => 
            li.querySelector('.url-status.completed')
        ).map(li => li.querySelector('.url-text').textContent);
        
        if (completedUrls.length === 0) {
            alert('No completed URLs to save');
            return;
        }
        
        // Save to API if available
        if (window.chatbotAPI && typeof window.chatbotAPI.addUrlContent === 'function') {
            completedUrls.forEach(url => {
                window.chatbotAPI.addUrlContent(url, `Content crawled from ${url}`);
            });
        }
        
        alert('Training data saved successfully!');
        
        // Clear the list
        urlsList.innerHTML = '<li class="empty-list">No URLs added</li>';
        saveBtn.disabled = true;
        crawlBtn.disabled = false;
        addUrlBtn.disabled = false;
    }
}

/**
 * Validate URL format
 */
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Initialize knowledge form functionality
 */
function initKnowledgeForm() {
    const knowledgeForm = document.querySelector('.knowledge-form');
    const titleInput = document.getElementById('knowledge-title');
    const contentInput = document.getElementById('knowledge-content');
    const tagsInput = document.getElementById('knowledge-tags');
    const addBtn = document.querySelector('.btn-add-knowledge');
    const knowledgeTable = document.querySelector('.knowledge-table tbody');
    
    addBtn.addEventListener('click', () => {
        addKnowledge();
    });
    
    function addKnowledge() {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const tags = tagsInput.value.trim();
        
        if (!title || !content) {
            alert('Please enter both title and content');
            return;
        }
        
        // Clear the "No knowledge entries added" row if it exists
        if (knowledgeTable.querySelector('.empty-table')) {
            knowledgeTable.innerHTML = '';
        }
        
        // Create new row
        const row = document.createElement('tr');
        const dateAdded = new Date().toLocaleDateString();
        
        row.innerHTML = `
            <td>${title}</td>
            <td>${tags || '-'}</td>
            <td>${dateAdded}</td>
            <td>
                <button class="btn-edit" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add delete functionality
        row.querySelector('.btn-delete').addEventListener('click', () => {
            row.remove();
            
            // If no entries are left, show the empty message
            if (knowledgeTable.children.length === 0) {
                knowledgeTable.innerHTML = `<tr><td colspan="4" class="empty-table">No knowledge entries added</td></tr>`;
            }
        });
        
        knowledgeTable.appendChild(row);
        
        // Clear inputs
        titleInput.value = '';
        contentInput.value = '';
        tagsInput.value = '';
    }
}

/**
 * Initialize Q&A form functionality
 */
function initQAForm() {
    const qaForm = document.querySelector('.qa-form');
    const questionInput = document.getElementById('question-input');
    const answerInput = document.getElementById('answer-input');
    const tagsInput = document.getElementById('qa-tags');
    const addBtn = document.querySelector('.btn-add-qa');
    const qaTable = document.querySelector('.qa-table tbody');
    
    addBtn.addEventListener('click', () => {
        addQAPair();
    });
    
    function addQAPair() {
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();
        const tags = tagsInput.value.trim();
        
        if (!question || !answer) {
            alert('Please enter both question and answer');
            return;
        }
        
        // Clear the "No Q&A pairs added" row if it exists
        if (qaTable.querySelector('.empty-table')) {
            qaTable.innerHTML = '';
        }
        
        // Create new row
        const row = document.createElement('tr');
        const dateAdded = new Date().toLocaleDateString();
        
        row.innerHTML = `
            <td>${question}</td>
            <td>${tags || '-'}</td>
            <td>${dateAdded}</td>
            <td>
                <button class="btn-edit" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add delete functionality
        row.querySelector('.btn-delete').addEventListener('click', () => {
            row.remove();
            
            // If no entries are left, show the empty message
            if (qaTable.children.length === 0) {
                qaTable.innerHTML = `<tr><td colspan="4" class="empty-table">No Q&A pairs added</td></tr>`;
            }
        });
        
        qaTable.appendChild(row);
        
        // Clear inputs
        questionInput.value = '';
        answerInput.value = '';
        tagsInput.value = '';
    }
}

/**
 * Initialize canned responses functionality
 */
function initCannedResponses() {
    const responseForm = document.querySelector('.canned-response-form');
    const nameInput = document.getElementById('response-name');
    const triggersInput = document.getElementById('response-triggers');
    const contentInput = document.getElementById('response-content');
    const responsesTable = document.querySelector('.responses-table tbody');
    
    responseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addCannedResponse();
    });
    
    function addCannedResponse() {
        const name = nameInput.value.trim();
        const triggers = triggersInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!name || !triggers || !content) {
            alert('Please fill in all fields');
            return;
        }
        
        // Clear the "No canned responses yet" row if it exists
        if (responsesTable.querySelector('.empty-table')) {
            responsesTable.innerHTML = '';
        }
        
        // Create new row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${triggers}</td>
            <td>${content.substring(0, 50)}${content.length > 50 ? '...' : ''}</td>
            <td>
                <button class="btn-edit" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        // Add delete functionality
        row.querySelector('.btn-delete').addEventListener('click', () => {
            row.remove();
            
            // If no entries are left, show the empty message
            if (responsesTable.children.length === 0) {
                responsesTable.innerHTML = `<tr><td colspan="4" class="empty-table">No canned responses yet</td></tr>`;
            }
        });
        
        responsesTable.appendChild(row);
        
        // Clear inputs
        nameInput.value = '';
        triggersInput.value = '';
        contentInput.value = '';
    }
}

/**
 * Initialize fallback responses functionality
 */
function initFallbackResponses() {
    const fallbackForm = document.querySelector('.fallback-responses-form');
    const addFallbackBtn = document.querySelector('.btn-add-fallback');
    const fallbackList = document.querySelector('.fallback-responses-list');
    
    // Load existing fallback responses from API
    if (window.chatbotAPI && typeof window.chatbotAPI.getChatbotSettings === 'function') {
        const settings = window.chatbotAPI.getChatbotSettings();
        if (settings && window.chatbotAPI.getStats()) {
            const responses = window.chatbotAPI.getStats().fallbackResponses || [];
            
            // Clear the list and add current responses
            fallbackList.innerHTML = '';
            
            if (responses.length > 0) {
                responses.forEach(response => {
                    addFallbackResponse(response);
                });
            } else {
                // Add default responses
                addFallbackResponse("I'm sorry, I don't understand. Could you rephrase your question?");
                addFallbackResponse("I'm not sure I understand. Could you try asking in a different way?");
                addFallbackResponse("I'm still learning. Could you please clarify what you're asking about?");
            }
        }
    }
    
    // Add Fallback button
    addFallbackBtn.addEventListener('click', () => {
        addFallbackResponse('');
    });
    
    // Function to add a fallback response to the list
    function addFallbackResponse(text) {
        const fallbackItem = document.createElement('div');
        fallbackItem.className = 'fallback-response-item';
        fallbackItem.innerHTML = `
            <textarea rows="3" placeholder="Enter fallback response...">${text}</textarea>
            <div class="actions">
                <button type="button" class="btn-delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add delete functionality
        fallbackItem.querySelector('.btn-delete').addEventListener('click', () => {
            fallbackItem.remove();
        });
        
        fallbackList.appendChild(fallbackItem);
    }
    
    // Handle existing delete buttons
    const deleteButtons = fallbackList.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.fallback-response-item').remove();
        });
    });
    
    // Add Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        initFallbackResponses(); // Reset to original state
    });
    
    // Make sure Cancel button is inserted before Save button
    const actionGroup = fallbackForm.querySelector('.action-group');
    const saveBtn = actionGroup.querySelector('.btn-primary');
    actionGroup.insertBefore(cancelBtn, saveBtn);
    
    // Form submission
    fallbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect all fallback responses
        const fallbackResponses = [];
        const textareas = fallbackList.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            const response = textarea.value.trim();
            if (response) {
                fallbackResponses.push(response);
            }
        });
        
        // Save to API if available
        if (window.chatbotAPI && typeof window.chatbotAPI.updateSettings === 'function') {
            window.chatbotAPI.updateSettings({
                fallbackResponses: fallbackResponses
            });
        }
        
        alert('Fallback responses saved!');
    });
}

/**
 * Initialize greeting responses functionality
 */
function initGreetingResponses() {
    const greetingForm = document.querySelector('.greeting-responses-form');
    const addGreetingBtn = document.querySelector('.btn-add-greeting');
    const greetingList = document.querySelector('.greeting-responses-list');
    
    // Load existing greeting responses from API
    if (window.chatbotAPI && typeof window.chatbotAPI.getChatbotSettings === 'function') {
        const settings = window.chatbotAPI.getChatbotSettings();
        if (settings && window.chatbotAPI.getStats()) {
            const responses = window.chatbotAPI.getStats().greetingResponses || [];
            
            // Clear the list and add current responses
            greetingList.innerHTML = '';
            
            if (responses.length > 0) {
                responses.forEach(response => {
                    addGreetingResponse(response);
                });
            } else {
                // Add default responses
                addGreetingResponse("Hello! How can I assist you today?");
                addGreetingResponse("Hi there! Welcome to GPT Learning Hub. What can I help you with?");
                addGreetingResponse("Welcome! I'm your AI assistant. How may I help you today?");
            }
        }
    }
    
    // Add Greeting button
    addGreetingBtn.addEventListener('click', () => {
        addGreetingResponse('');
    });
    
    // Function to add a greeting response to the list
    function addGreetingResponse(text) {
        const greetingItem = document.createElement('div');
        greetingItem.className = 'greeting-response-item';
        greetingItem.innerHTML = `
            <textarea rows="3" placeholder="Enter greeting message...">${text}</textarea>
            <div class="actions">
                <button type="button" class="btn-delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Add delete functionality
        greetingItem.querySelector('.btn-delete').addEventListener('click', () => {
            greetingItem.remove();
        });
        
        greetingList.appendChild(greetingItem);
    }
    
    // Handle existing delete buttons
    const deleteButtons = greetingList.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.greeting-response-item').remove();
        });
    });
    
    // Add Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        initGreetingResponses(); // Reset to original state
    });
    
    // Make sure Cancel button is inserted before Save button
    const actionGroup = greetingForm.querySelector('.action-group');
    const saveBtn = actionGroup.querySelector('.btn-primary');
    actionGroup.insertBefore(cancelBtn, saveBtn);
    
    // Form submission
    greetingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect all greeting responses
        const greetingResponses = [];
        const textareas = greetingList.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            const response = textarea.value.trim();
            if (response) {
                greetingResponses.push(response);
            }
        });
        
        // Save to API if available
        if (window.chatbotAPI && typeof window.chatbotAPI.updateSettings === 'function') {
            window.chatbotAPI.updateSettings({
                greetingResponses: greetingResponses
            });
        }
        
        alert('Greeting messages saved!');
    });
}

/**
 * Initialize settings functionality
 */
function initSettings() {
    const temperatureInput = document.getElementById('temperature');
    const temperatureValue = document.querySelector('.range-value');
    
    // Get current settings from API
    if (window.chatbotAPI && typeof window.chatbotAPI.getChatbotSettings === 'function') {
        const currentSettings = window.chatbotAPI.getChatbotSettings();
        
        // Populate form with current settings
        document.getElementById('bot-name').value = currentSettings.botName || '';
        document.getElementById('welcome-message').value = currentSettings.welcomeMessage || '';
        document.getElementById('chatbot-position').value = currentSettings.position || 'bottom-right';
        document.getElementById('chatbot-theme').value = currentSettings.theme || 'light';
        document.getElementById('auto-open').checked = currentSettings.autoOpen;
        document.getElementById('show-typing').checked = currentSettings.showTyping;
        document.getElementById('collect-feedback').checked = currentSettings.collectFeedback;
        document.getElementById('response-delay').value = currentSettings.responseDelay || 800;
        document.getElementById('inactive-timeout').value = currentSettings.inactiveTimeout || 30;
        document.getElementById('api-model').value = currentSettings.model || 'gpt-3.5-turbo';
        temperatureInput.value = currentSettings.temperature || 0.7;
        temperatureValue.textContent = currentSettings.temperature || 0.7;
        document.getElementById('max-tokens').value = currentSettings.maxTokens || 500;
        document.getElementById('system-prompt').value = currentSettings.systemPrompt || '';
    }
    
    // Update range value display
    temperatureInput.addEventListener('input', () => {
        temperatureValue.textContent = temperatureInput.value;
    });
    
    // IP restriction toggle
    const ipRestrictionCheckbox = document.getElementById('ip-restriction');
    const allowedIpsTextarea = document.getElementById('allowed-ips');
    
    ipRestrictionCheckbox.addEventListener('change', () => {
        allowedIpsTextarea.disabled = !ipRestrictionCheckbox.checked;
    });
    
    // Settings cancel button
    const cancelSettingsBtn = document.querySelector('.settings-form .btn-secondary');
    cancelSettingsBtn.addEventListener('click', () => {
        // Reset to original values
        initSettings();
    });
    
    // Settings save button
    const saveSettingsBtn = document.querySelector('.settings-form .btn-primary');
    saveSettingsBtn.addEventListener('click', () => {
        if (window.chatbotAPI && typeof window.chatbotAPI.updateSettings === 'function') {
            // Collect settings from form
            const newSettings = {
                botName: document.getElementById('bot-name').value,
                welcomeMessage: document.getElementById('welcome-message').value,
                position: document.getElementById('chatbot-position').value,
                theme: document.getElementById('chatbot-theme').value,
                autoOpen: document.getElementById('auto-open').checked,
                showTyping: document.getElementById('show-typing').checked,
                collectFeedback: document.getElementById('collect-feedback').checked,
                responseDelay: parseInt(document.getElementById('response-delay').value),
                inactiveTimeout: parseInt(document.getElementById('inactive-timeout').value),
                model: document.getElementById('api-model').value,
                temperature: parseFloat(temperatureInput.value),
                maxTokens: parseInt(document.getElementById('max-tokens').value),
                systemPrompt: document.getElementById('system-prompt').value
            };
            
            // Update settings in API
            window.chatbotAPI.updateSettings(newSettings);
            
            alert('Settings saved successfully!');
        } else {
            alert('Settings saved!');
        }
    });
}

/**
 * Initialize security functionality
 */
function initSecurity() {
    // Change password form
    const changePasswordForm = document.querySelector('.change-password-form');
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('New password and confirmation do not match');
            return;
        }
        
        // Validate password security
        if (!validatePassword(newPassword)) {
            alert('Password does not meet security requirements');
            return;
        }
        
        // In a real app, this would verify current password and update
        // For this demo, we'll check against the hard-coded demo/gptlearninghub credential
        if (currentPassword !== 'gptlearninghub') {
            alert('Current password is incorrect');
            return;
        }
        
        // Save new password to localStorage
        if (window.chatbotAPI && typeof window.chatbotAPI.updateSettings === 'function') {
            window.chatbotAPI.updateSettings({
                adminPassword: newPassword
            });
        } else {
            localStorage.setItem('admin_password', newPassword);
        }
        
        alert('Password changed successfully!');
        
        // Clear form
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    });
    
    // Security questions form
    const securityQuestionsForm = document.querySelector('.security-questions-form');
    
    // Load any existing security questions if available
    loadSecurityQuestions();
    
    // Add cancel button to security questions form
    const questionsCancelBtn = document.createElement('button');
    questionsCancelBtn.type = 'button';
    questionsCancelBtn.className = 'btn btn-secondary';
    questionsCancelBtn.textContent = 'Cancel';
    questionsCancelBtn.style.marginRight = '10px';
    
    // Get submit button to place cancel before it
    const questionsSubmitBtn = securityQuestionsForm.querySelector('.btn-primary');
    questionsSubmitBtn.parentElement.insertBefore(questionsCancelBtn, questionsSubmitBtn);
    
    // Cancel button functionality
    questionsCancelBtn.addEventListener('click', () => {
        loadSecurityQuestions();
    });
    
    securityQuestionsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect all security questions and answers
        const securityQuestions = [];
        
        for (let i = 1; i <= 5; i++) {
            const question = document.getElementById(`question-${i}`).value.trim();
            const answer = document.getElementById(`answer-${i}`).value.trim();
            
            if (!question || !answer) {
                alert('Please provide both question and answer for all security questions');
                return;
            }
            
            securityQuestions.push({ question, answer });
        }
        
        // Save security questions
        if (window.chatbotAPI && typeof window.chatbotAPI.updateSettings === 'function') {
            window.chatbotAPI.updateSettings({
                securityQuestions: securityQuestions
            });
        } else {
            localStorage.setItem('security_questions', JSON.stringify(securityQuestions));
        }
        
        alert('Security questions saved!');
    });
    
    // Access control form
    const accessControlForm = document.querySelector('.access-control-form');
    
    // Load existing access control settings
    loadAccessControlSettings();
    
    // Add cancel button to access control form
    const accessCancelBtn = document.createElement('button');
    accessCancelBtn.type = 'button';
    accessCancelBtn.className = 'btn btn-secondary';
    accessCancelBtn.textContent = 'Cancel';
    accessCancelBtn.style.marginRight = '10px';
    
    // Get submit button to place cancel before it
    const accessSubmitBtn = accessControlForm.querySelector('.btn-primary');
    accessSubmitBtn.parentElement.insertBefore(accessCancelBtn, accessSubmitBtn);
    
    // Cancel button functionality
    accessCancelBtn.addEventListener('click', () => {
        loadAccessControlSettings();
    });
    
    accessControlForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect access control settings
        const accessSettings = {
            sessionTimeout: parseInt(document.getElementById('session-timeout').value),
            require2FA: document.getElementById('require-2fa').checked,
            loginNotification: document.getElementById('login-notification').checked,
            ipRestriction: document.getElementById('ip-restriction').checked,
            allowedIPs: document.getElementById('allowed-ips').value.split('\n').map(ip => ip.trim()).filter(ip => ip)
        };
        
        // Save access control settings
        if (window.chatbotAPI && typeof window.chatbotAPI.updateSettings === 'function') {
            window.chatbotAPI.updateSettings({
                accessControl: accessSettings
            });
        } else {
            localStorage.setItem('access_control', JSON.stringify(accessSettings));
        }
        
        alert('Access settings saved!');
    });
}

/**
 * Load security questions from storage
 */
function loadSecurityQuestions() {
    let securityQuestions = [];
    
    // Try to load from API or localStorage
    if (window.chatbotAPI && typeof window.chatbotAPI.getChatbotSettings === 'function') {
        const settings = window.chatbotAPI.getChatbotSettings();
        securityQuestions = settings.securityQuestions || [];
    } else {
        const savedQuestions = localStorage.getItem('security_questions');
        if (savedQuestions) {
            securityQuestions = JSON.parse(savedQuestions);
        }
    }
    
    // If no saved questions, use defaults
    if (!securityQuestions || securityQuestions.length < 5) {
        securityQuestions = [
            { question: "What was the name of your first pet?", answer: "" },
            { question: "What was the first street you lived on?", answer: "" },
            { question: "What was the name of your elementary school?", answer: "" },
            { question: "What was your childhood nickname?", answer: "" },
            { question: "What is your mother's maiden name?", answer: "" }
        ];
    }
    
    // Populate the form
    for (let i = 0; i < 5; i++) {
        const question = document.getElementById(`question-${i+1}`);
        const answer = document.getElementById(`answer-${i+1}`);
        
        if (question && answer) {
            question.value = securityQuestions[i].question || "";
            answer.value = securityQuestions[i].answer || "";
        }
    }
}

/**
 * Load access control settings from storage
 */
function loadAccessControlSettings() {
    let accessSettings = {
        sessionTimeout: 30,
        require2FA: true,
        loginNotification: true,
        ipRestriction: false,
        allowedIPs: []
    };
    
    // Try to load from API or localStorage
    if (window.chatbotAPI && typeof window.chatbotAPI.getChatbotSettings === 'function') {
        const settings = window.chatbotAPI.getChatbotSettings();
        if (settings.accessControl) {
            accessSettings = settings.accessControl;
        }
    } else {
        const savedSettings = localStorage.getItem('access_control');
        if (savedSettings) {
            accessSettings = JSON.parse(savedSettings);
        }
    }
    
    // Populate the form
    document.getElementById('session-timeout').value = accessSettings.sessionTimeout || 30;
    document.getElementById('require-2fa').checked = accessSettings.require2FA;
    document.getElementById('login-notification').checked = accessSettings.loginNotification;
    document.getElementById('ip-restriction').checked = accessSettings.ipRestriction;
    
    const allowedIpsTextarea = document.getElementById('allowed-ips');
    allowedIpsTextarea.value = (accessSettings.allowedIPs || []).join('\n');
    allowedIpsTextarea.disabled = !accessSettings.ipRestriction;
}

/**
 * Validate password security
 */
function validatePassword(password) {
    // At least 8 characters
    if (password.length < 8) return false;
    
    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    
    // At least one number
    if (!/[0-9]/.test(password)) return false;
    
    // At least one special character
    if (!/[^A-Za-z0-9]/.test(password)) return false;
    
    return true;
}

/**
 * Initialize dashboard statistics
 */
function initDashboardStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    // First clear any existing values to show "Loading..." state
    statValues.forEach(stat => {
        stat.textContent = 'Loading...';
    });
    
    // Check if the chatbot API is available for real data
    if (window.chatbotAPI && typeof window.chatbotAPI.getStats === 'function') {
        try {
            // Get real-time stats from the API
            const stats = window.chatbotAPI.getStats();
            
            // Update the dashboard with real data
            if (statValues.length >= 4) {
                statValues[0].textContent = stats.totalConversations || '0'; // Total conversations
                statValues[1].textContent = stats.uniqueUsers || '0';        // Unique users
                statValues[2].textContent = stats.documents || '0';          // Documents
                statValues[3].textContent = `${stats.satisfactionRate || '0'}%`; // Satisfaction rate
            }
            
            // Update recent activity table
            updateRecentActivity(stats);
            
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            
            // Reset to empty values on error
            statValues.forEach(stat => {
                stat.textContent = '0';
            });
            statValues[3].textContent = '0%'; // Make sure satisfaction rate shows as percentage
        }
    } else {
        // If API is not available, set all counters to 0
        statValues.forEach((stat, index) => {
            stat.textContent = index === 3 ? '0%' : '0';
        });
    }
}

/**
 * Update recent activity table with conversation data
 */
function updateRecentActivity(stats) {
    const activityTable = document.querySelector('.activity-table tbody');
    
    // Clear existing content
    activityTable.innerHTML = '';
    
    // Get conversations from API if available
    const conversations = window.chatbotAPI && typeof window.chatbotAPI.getConversations === 'function' 
        ? window.chatbotAPI.getConversations() 
        : [];
    
    if (conversations && conversations.length > 0) {
        // Display the 5 most recent conversations
        const recentConversations = conversations.slice(-5).reverse();
        
        recentConversations.forEach(convo => {
            const row = document.createElement('tr');
            
            // Format date for display
            const date = new Date(convo.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${convo.user || 'Anonymous'}</td>
                <td>${convo.userMessage.substring(0, 30)}${convo.userMessage.length > 30 ? '...' : ''}</td>
                <td>${convo.botResponse.substring(0, 30)}${convo.botResponse.length > 30 ? '...' : ''}</td>
            `;
            
            activityTable.appendChild(row);
        });
    } else {
        // No conversations found
        activityTable.innerHTML = '<tr><td colspan="4" class="empty-table">No recent activity</td></tr>';
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    // In a real application, this would send a logout request to the server
    if (confirm('Are you sure you want to log out?')) {
        // Clear any stored user data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('tokenExpiry');
        
        // Redirect to login
        showLoginModal();
    }
}

/**
 * Show login modal
 */
function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.style.display = 'flex';
}

/**
 * Show forgot password modal
 */
function showForgotPasswordModal() {
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    forgotPasswordModal.style.display = 'flex';
}

// Add these CSS styles to the existing styles
const style = document.createElement('style');
style.textContent = `
    .url-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
        margin-bottom: 8px;
    }
    
    .url-text {
        flex: 1;
        word-break: break-all;
    }
    
    .url-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .url-status.pending {
        background: #e2e8f0;
        color: #64748b;
    }
    
    .url-status.crawling {
        background: #bfdbfe;
        color: #2563eb;
    }
    
    .url-status.completed {
        background: #bbf7d0;
        color: #16a34a;
    }
    
    .url-status.error {
        background: #fecaca;
        color: #dc2626;
    }
    
    .progress-bar {
        flex: 1;
        height: 20px;
        background: #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
    }
    
    .progress {
        height: 100%;
        background: #3b82f6;
        color: white;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        transition: width 0.3s ease;
    }
    
    .btn-save-urls {
        margin-left: 10px;
    }
    
    .files-table .status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
    }
    
    .files-table .status.pending {
        background: #e2e8f0;
        color: #64748b;
    }
    
    .files-table .status.processing {
        background: #bfdbfe;
        color: #2563eb;
    }
    
    .files-table .status.completed {
        background: #bbf7d0;
        color: #16a34a;
    }
    
    .files-table .status.error {
        background: #fecaca;
        color: #dc2626;
    }
    
    .files-table .progress-bar {
        width: 150px;
        height: 20px;
        background: #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
        margin-right: 10px;
    }
    
    .files-table .progress {
        height: 100%;
        background: #3b82f6;
        color: white;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        transition: width 0.3s ease;
    }
    
    .files-table .actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .btn-save-docs {
        margin-left: 10px;
    }
`;
document.head.appendChild(style); 