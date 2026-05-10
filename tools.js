// tools.js - Enhanced Tool Suite for OmniWeb (Flat Structure)

document.addEventListener('DOMContentLoaded', () => {
    initTextCounter();
    initPasswordGenerator();
    initCalculator();
    initJSONFormatter();
  });
  
  // ==================== Text Counter ====================
  function initTextCounter() {
    const textarea = document.getElementById('text-input');
    const stats = document.getElementById('text-stats');
  
    if (!textarea || !stats) return;
  
    function updateStats() {
      const text = textarea.value;
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const chars = text.length;
      const lines = text.split('\n').length;
  
      stats.innerHTML = `
        Characters: <strong>${chars}</strong> | 
        Words: <strong>${words}</strong> | 
        Lines: <strong>${lines}</strong>
      `;
    }
  
    textarea.addEventListener('input', updateStats);
    updateStats();
  }
  
  // ==================== Password Generator ====================
  let currentPassword = '';
  
  function generatePassword() {
    const length = 16;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;
  
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
    let chars = lower + upper;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
  
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
  
    currentPassword = password;
    document.getElementById('password-output').value = password;
  }
  
  function copyPassword() {
    if (!currentPassword) return;
    navigator.clipboard.writeText(currentPassword).then(() => {
      alert('Password copied to clipboard!');
    });
  }
  
  // ==================== Calculator ====================
  function initCalculator() {
    const display = document.getElementById('calc-display');
    let currentInput = '0';
    let shouldReset = false;
  
    const calcGrid = document.querySelector('.calc-grid');
    if (!calcGrid || !display) return;
  
    const buttons = [
      'C', '±', '%', '÷',
      '7', '8', '9', '×',
      '4', '5', '6', '-',
      '1', '2', '3', '+',
      '0', '.', '='
    ];
  
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn;
      button.style.padding = '16px';
      button.style.fontSize = '1.1rem';
      button.style.fontWeight = '600';
  
      if (['÷', '×', '-', '+', '='].includes(btn)) {
        button.style.background = 'var(--accent)';
        button.style.color = 'white';
      }
  
      button.addEventListener('click', () => handleCalcInput(btn));
      calcGrid.appendChild(button);
    });
  
    function handleCalcInput(val) {
      if ('0123456789.'.includes(val)) {
        if (shouldReset) {
          currentInput = val;
          shouldReset = false;
        } else {
          currentInput = currentInput === '0' ? val : currentInput + val;
        }
      } else if (val === 'C') {
        currentInput = '0';
      } else if (val === '±') {
        currentInput = (-parseFloat(currentInput)).toString();
      } else if (val === '%') {
        currentInput = (parseFloat(currentInput) / 100).toString();
      } else if (['+', '-', '×', '÷'].includes(val)) {
        // Simple evaluation logic (for demo purposes)
        currentInput += ` ${val} `;
      } else if (val === '=') {
        try {
          // Safe evaluation using Function (better than eval for this scope)
          currentInput = Function('"use strict";return (' + currentInput.replace('×','*').replace('÷','/') + ')')();
        } catch (e) {
          currentInput = 'Error';
        }
        shouldReset = true;
      }
  
      display.value = currentInput;
    }
  }
  
  // ==================== JSON Formatter ====================
  function formatJSON() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    
    try {
      const parsed = JSON.parse(input.value);
      output.textContent = JSON.stringify(parsed, null, 2);
      output.style.color = 'var(--text)';
    } catch (err) {
      output.textContent = 'Invalid JSON: ' + err.message;
      output.style.color = '#f87171';
    }
  }
  
  function copyJSON() {
    const output = document.getElementById('json-output');
    if (!output.textContent) return;
    
    navigator.clipboard.writeText(output.textContent).then(() => {
      alert('Formatted JSON copied!');
    });
  }