// DOM elements
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const convertBtn = document.getElementById('convert-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const clearBtn = document.getElementById('clear-btn');
const fileUpload = document.getElementById('file-upload');
const dictUpload = document.getElementById('dict-upload');
const resetDictBtn = document.getElementById('reset-dict-btn');
const inputCharCount = document.getElementById('input-char-count');
const outputCharCount = document.getElementById('output-char-count');
const notification = document.getElementById('notification');

// Initialize the application
function init() {
    // Load any saved dictionary from localStorage
    const savedDict = localStorage.getItem('meeteiMayekDictionary');
    if (savedDict) {
        try {
            const customDict = JSON.parse(savedDict);
            mergeDictionaries(customDict);
        } catch (error) {
            console.error('Error loading saved dictionary:', error);
        }
    }
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Convert button click
    convertBtn.addEventListener('click', convertText);
    
    // Copy button click
    copyBtn.addEventListener('click', copyOutput);
    
    // Download button click
    downloadBtn.addEventListener('click', downloadOutput);
    
    // Clear button click
    clearBtn.addEventListener('click', clearInput);
    
    // File upload change
    fileUpload.addEventListener('change', handleFileUpload);
    
    // Dictionary upload change
    dictUpload.addEventListener('change', handleDictionaryUpload);
    
    // Reset dictionary button click
    resetDictBtn.addEventListener('click', resetCustomDictionary);
    
    // Input text changes
    inputText.addEventListener('input', updateCharCount);
}

// Convert text using the dictionary
function convertText() {
    const text = inputText.value;
    
    if (!text.trim()) {
        showNotification('Please enter some text to convert', 'error');
        return;
    }
    
    // Show loading state
    convertBtn.classList.add('loading');
    outputText.classList.add('loading');
    
    // Use setTimeout to allow the UI to update before the conversion
    setTimeout(() => {
        try {
            const dictionary = getCurrentDictionary();
            let convertedText = text;
            
            // Sort dictionary keys by length (longest first) to prevent partial replacements
            const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
            
            // Perform one-pass replacement
            for (const key of sortedKeys) {
                const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                convertedText = convertedText.replace(regex, dictionary[key]);
            }
            
            // Display the converted text
            outputText.textContent = convertedText;
            outputCharCount.textContent = convertedText.length;
            
            showNotification('Text converted successfully!');
        } catch (error) {
            console.error('Conversion error:', error);
            outputText.textContent = 'Error: Failed to convert text.';
            showNotification('Error converting text', 'error');
        } finally {
            // Remove loading state
            convertBtn.classList.remove('loading');
            outputText.classList.remove('loading');
        }
    }, 50);
}

// Copy output to clipboard
function copyOutput() {
    const text = outputText.textContent;
    
    if (!text) {
        showNotification('No text to copy', 'error');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Text copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text:', err);
        showNotification('Failed to copy text', 'error');
    });
}

// Download output as a text file
function downloadOutput() {
    const text = outputText.textContent;
    
    if (!text) {
        showNotification('No text to download', 'error');
        return;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-meetei-mayek.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    showNotification('File downloaded successfully!');
}

// Clear input and output
function clearInput() {
    inputText.value = '';
    outputText.textContent = '';
    inputCharCount.textContent = '0';
    outputCharCount.textContent = '0';
    showNotification('Text cleared');
}

// Handle text file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        
        // Check if the content is too large (approx. 50,000 words)
        if (content.length > 500000) { // Rough estimate
            showNotification('File is too large. Please use files under 50,000 words.', 'error');
            return;
        }
        
        inputText.value = content;
        updateCharCount();
        showNotification('File uploaded successfully!');
    };
    
    reader.onerror = function() {
        showNotification('Error reading file', 'error');
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    event.target.value = '';
}

// Handle dictionary file upload
function handleDictionaryUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const customDict = JSON.parse(e.target.result);
            
            if (mergeDictionaries(customDict)) {
                // Save the custom dictionary to localStorage
                localStorage.setItem('meeteiMayekDictionary', JSON.stringify(customDict));
                showNotification('Custom dictionary uploaded and merged!');
            } else {
                showNotification('Invalid dictionary format', 'error');
            }
        } catch (error) {
            console.error('Error parsing dictionary:', error);
            showNotification('Error parsing dictionary file', 'error');
        }
    };
    
    reader.onerror = function() {
        showNotification('Error reading dictionary file', 'error');
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    event.target.value = '';
}

// Reset to the default dictionary
function resetCustomDictionary() {
    resetDictionary();
    localStorage.removeItem('meeteiMayekDictionary');
    showNotification('Dictionary reset to default');
}

// Update character count
function updateCharCount() {
    inputCharCount.textContent = inputText.value.length;
}

// Show notification
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = 'notification';
    
    if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else {
        notification.style.backgroundColor = '#2ecc71';
    }
    
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
