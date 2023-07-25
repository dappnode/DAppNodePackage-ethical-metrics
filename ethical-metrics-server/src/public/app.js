const toggleFileButton = document.getElementById('toggle-file-btn');
const registerButton = document.getElementById('register-btn');
const unregisterButton = document.getElementById('unregister-btn');
const fileContentDisplay = document.getElementById('file-content-display');
const feedbackElement = document.getElementById('feedback');

let isFileContentVisible = false;

const getFileContent = async () => {
    try {
        const response = await fetch('/api/getFileContent');
        const data = await response.json();
        fileContentDisplay.textContent = data.content;
        toggleFileButton.textContent = 'Hide Tor Instance';
        isFileContentVisible = true;
        fileContentDisplay.style.display = 'block';
    } catch (error) {
        fileContentDisplay.textContent = 'Error fetching file content:\n' + error.message;
    }
};

const hideFileContent = () => {
    fileContentDisplay.style.display = 'none';
    toggleFileButton.textContent = 'Show Tor Instance';
    isFileContentVisible = false;
};

toggleFileButton.addEventListener('click', () => {
    if (isFileContentVisible) {
        hideFileContent();
    } else {
        getFileContent();
    }
});

// Function to display feedback message
const showFeedback = (message, isSuccess) => {
    feedbackElement.style.display = 'block';
    feedbackElement.textContent = message;
    feedbackElement.style.color = isSuccess ? 'green' : 'red';
    setTimeout(() => {
        feedbackElement.style.display = 'none';
    }, 3000); // Hide the feedback after 3 seconds
};

registerButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
        });

        const data = await response.json();
        console.log(data);
        showFeedback(data.message, true); // Show success feedback
    } catch (error) {
        console.error('Error in register API call:', error);
        const errorMessage = await error.response.text();
        console.error('Error message:', errorMessage);
        showFeedback(errorMessage || 'Failed to register onion instance', false); // Show error feedback
    }
});

unregisterButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/unregister', {
            method: 'POST',
        });

        const data = await response.json();
        console.log(data);
        showFeedback(data.message, true); // Show success feedback
    } catch (error) {
        console.error('Error in unregister API call:', error);
        const errorMessage = await error.response.text();
        console.error('Error message:', errorMessage);
        showFeedback(errorMessage || 'Failed to unregister onion instance', false); // Show error feedback
    }
});
