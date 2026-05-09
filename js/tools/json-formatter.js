/**
 * JSON Formatter Tool
 * Formats, minifies, validates, and beautifies JSON
 */

function initJsonFormatter() {
  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  const jsonStatus = document.getElementById('json-status');
  const formatBtn = document.getElementById('format-json');
  const minifyBtn = document.getElementById('minify-json');
  const validateBtn = document.getElementById('validate-json');
  const copyBtn = document.getElementById('copy-json');

  if (!jsonInput) return;

  function showStatus(message, type) {
    jsonStatus.textContent = message;
    jsonStatus.className = `json-status ${type}`;
    jsonStatus.hidden = false;

    setTimeout(() => {
      jsonStatus.hidden = true;
    }, 3000);
  }

  function parseJSON(text) {
    try {
      return { success: true, data: JSON.parse(text) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  function formatJSON() {
    const input = jsonInput.value.trim();
    if (!input) {
      showStatus('Please enter JSON', 'error');
      return;
    }

    const parsed = parseJSON(input);
    if (!parsed.success) {
      showStatus(`Invalid JSON: ${parsed.error}`, 'error');
      return;
    }

    try {
      const formatted = JSON.stringify(parsed.data, null, 2);
      jsonOutput.value = formatted;
      showStatus('JSON formatted successfully', 'success');
    } catch (error) {
      showStatus(`Error formatting JSON: ${error.message}`, 'error');
    }
  }

  function minifyJSON() {
    const input = jsonInput.value.trim();
    if (!input) {
      showStatus('Please enter JSON', 'error');
      return;
    }

    const parsed = parseJSON(input);
    if (!parsed.success) {
      showStatus(`Invalid JSON: ${parsed.error}`, 'error');
      return;
    }

    try {
      const minified = JSON.stringify(parsed.data);
      jsonOutput.value = minified;
      showStatus('JSON minified successfully', 'success');
    } catch (error) {
      showStatus(`Error minifying JSON: ${error.message}`, 'error');
    }
  }

  function validateJSON() {
    const input = jsonInput.value.trim();
    if (!input) {
      showStatus('Please enter JSON', 'error');
      return;
    }

    const parsed = parseJSON(input);
    if (parsed.success) {
      showStatus('✓ Valid JSON', 'success');
    } else {
      showStatus(`✗ Invalid JSON: ${parsed.error}`, 'error');
    }
  }

  if (formatBtn) {
    formatBtn.addEventListener('click', formatJSON);
  }

  if (minifyBtn) {
    minifyBtn.addEventListener('click', minifyJSON);
  }

  if (validateBtn) {
    validateBtn.addEventListener('click', validateJSON);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (jsonOutput.value) {
        navigator.clipboard.writeText(jsonOutput.value).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        });
      }
    });
  }

  // Load saved JSON from localStorage
  const savedInput = localStorage.getItem('jsonFormatterInput');
  if (savedInput) {
    jsonInput.value = savedInput;
  }

  // Save input on change
  jsonInput.addEventListener('input', debounce(() => {
    localStorage.setItem('jsonFormatterInput', jsonInput.value);
  }, 500));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initJsonFormatter);
} else {
  initJsonFormatter();
}
