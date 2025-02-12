const titleInput = document.getElementById('titleInput');
const submitBtn = document.getElementById('submitBtn');
const optimizeBtn = document.getElementById('optimizeBtn');
const editor = document.getElementById('editor');

// Function to type text with animation
function typeText(element, text, speed = 5) {
    let i = 0;
    element.innerHTML = '';
    element.style.opacity = '1'; // Ensure visibility
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            // Add multiple characters at once for faster rendering
            const chunkSize = 5; // Adjust based on performance
            element.innerHTML += text.substring(i, i + chunkSize);
            i += chunkSize;
        } else {
            clearInterval(typingInterval);
        }
    }, speed);
}

// Show loading indicator
function showLoading(message = 'Generating content...') {
    editor.innerHTML = `<div class="loading">${message}<div class="spinner"></div></div>`;
}

// Hide loading indicator
function hideLoading() {
    editor.innerHTML = '';
}

// Submit button click event
submitBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    if (!title) return alert('Please enter a title');

    showLoading(); // Show loading indicator

    try {
        const response = await fetch('http://localhost:8080/generate-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        const data = await response.json();
        hideLoading(); // Hide loading indicator
        typeText(editor, data.article);
    } catch (error) {
        console.error('Error:', error);
        hideLoading(); // Hide loading indicator
        alert('Failed to generate article. Please try again.');
    }
});

// Optimize button click event
optimizeBtn.addEventListener('click', async () => {
    const content = editor.innerHTML;
    if (!content) return alert('No content to optimize');

    showLoading('Optimizing content...'); // Show optimizing message with spinner

    try {
        const response = await fetch('http://localhost:8080/optimize-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });
        const data = await response.json();
        hideLoading(); // Hide loading indicator
        typeText(editor, data.optimizedArticle);
    } catch (error) {
        console.error('Error:', error);
        hideLoading(); // Hide loading indicator
        alert('Failed to optimize article. Please try again.');
    }
});
