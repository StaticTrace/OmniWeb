/**
 * Text Counter Tool
 * Counts characters, words, lines, and average word length
 */

function initTextCounter() {
  const textInput = document.getElementById('text-input');
  const charCount = document.getElementById('char-count');
  const wordCount = document.getElementById('word-count');
  const lineCount = document.getElementById('line-count');
  const avgWordLength = document.getElementById('avg-word-length');
  const clearBtn = document.getElementById('clear-text');

  if (!textInput) return;

  function updateStats() {
    const text = textInput.value;

    // Character count
    charCount.textContent = text.length;

    // Word count
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    wordCount.textContent = words;

    // Line count
    const lines = text === '' ? 0 : text.split('\n').length;
    lineCount.textContent = lines;

    // Average word length
    const avgLength = words === 0 ? 0 : (text.replace(/\s+/g, '').length / words).toFixed(1);
    avgWordLength.textContent = avgLength;
  }

  textInput.addEventListener('input', updateStats);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      textInput.value = '';
      updateStats();
    });
  }

  // Load saved text from localStorage
  const savedText = localStorage.getItem('textCounterInput');
  if (savedText) {
    textInput.value = savedText;
    updateStats();
  }

  // Save text on input
  textInput.addEventListener('input', debounce(() => {
    localStorage.setItem('textCounterInput', textInput.value);
  }, 500));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextCounter);
} else {
  initTextCounter();
}
