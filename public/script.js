document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shorten-form');
  const longUrlInput = document.getElementById('long-url');
  const submitBtn = document.getElementById('submit-btn');
  const resultContainer = document.getElementById('result-container');
  const errorContainer = document.getElementById('error-container');
  const shortUrlElem = document.getElementById('short-url');
  const copyBtn = document.getElementById('copy-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const longUrl = longUrlInput.value.trim();
    if (!longUrl) return;

    // Reset UI
    errorContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Shortening...';

    try {
      const response = await fetch('/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      // Success
      shortUrlElem.href = data.shortUrl;
      shortUrlElem.textContent = data.shortUrl;
      resultContainer.classList.remove('hidden');
      longUrlInput.value = ''; // clear input

    } catch (err) {
      errorContainer.textContent = err.message;
      errorContainer.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Shorten';
    }
  });

  copyBtn.addEventListener('click', () => {
    const textToCopy = shortUrlElem.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Visual feedback
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
      }, 2000);
    });
  });
});
