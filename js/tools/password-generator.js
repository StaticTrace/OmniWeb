/**
 * Password Generator Tool
 * Generates random passwords with customizable options
 */

const PASSWORD_CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

function initPasswordGenerator() {
  const lengthInput = document.getElementById('password-length');
  const lengthDisplay = document.getElementById('length-display');
  const uppercaseCheckbox = document.getElementById('include-uppercase');
  const lowercaseCheckbox = document.getElementById('include-lowercase');
  const numbersCheckbox = document.getElementById('include-numbers');
  const symbolsCheckbox = document.getElementById('include-symbols');
  const passwordInput = document.getElementById('generated-password');
  const generateBtn = document.getElementById('generate-password');
  const copyBtn = document.getElementById('copy-password');

  if (!lengthInput) return;

  // Update length display
  lengthInput.addEventListener('input', (e) => {
    lengthDisplay.textContent = e.target.value;
  });

  function generatePassword() {
    const length = parseInt(lengthInput.value);
    const useUppercase = uppercaseCheckbox.checked;
    const useLowercase = lowercaseCheckbox.checked;
    const useNumbers = numbersCheckbox.checked;
    const useSymbols = symbolsCheckbox.checked;

    // Check that at least one option is selected
    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
      alert('Please select at least one character type');
      return;
    }

    let chars = '';
    if (useUppercase) chars += PASSWORD_CHARS.uppercase;
    if (useLowercase) chars += PASSWORD_CHARS.lowercase;
    if (useNumbers) chars += PASSWORD_CHARS.numbers;
    if (useSymbols) chars += PASSWORD_CHARS.symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    passwordInput.value = password;
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', generatePassword);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (passwordInput.value) {
        navigator.clipboard.writeText(passwordInput.value).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 2000);
        });
      }
    });
  }

  // Generate initial password
  generatePassword();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPasswordGenerator);
} else {
  initPasswordGenerator();
}
