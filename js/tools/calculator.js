/**
 * Simple Calculator Tool
 * Basic arithmetic calculator with display
 */

function initCalculator() {
  const display = document.getElementById('calc-display');
  const buttons = document.querySelectorAll('.calc-btn');

  if (!display) return;

  let currentValue = '0';
  let previousValue = '';
  let operator = null;
  let shouldResetDisplay = false;

  function updateDisplay() {
    display.value = currentValue;
  }

  function clear() {
    currentValue = '0';
    previousValue = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
  }

  function deleteLastChar() {
    if (currentValue.length > 1) {
      currentValue = currentValue.slice(0, -1);
    } else {
      currentValue = '0';
    }
    updateDisplay();
  }

  function appendNumber(num) {
    if (shouldResetDisplay) {
      currentValue = num === '.' ? '0.' : num;
      shouldResetDisplay = false;
    } else {
      if (num === '.' && currentValue.includes('.')) return;
      currentValue = currentValue === '0' && num !== '.' ? num : currentValue + num;
    }
    updateDisplay();
  }

  function setOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
      calculate();
    }
    previousValue = currentValue;
    operator = op;
    shouldResetDisplay = true;
  }

  function calculate() {
    if (!operator || shouldResetDisplay) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    let result;
    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        result = current === 0 ? 'Error' : prev / current;
        break;
      default:
        return;
    }

    currentValue = result.toString();
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const num = button.dataset.num;
      const action = button.dataset.action;
      const op = button.dataset.operator;

      if (num) {
        appendNumber(num);
      } else if (action === 'clear') {
        clear();
      } else if (action === 'delete') {
        deleteLastChar();
      } else if (action === 'equals') {
        calculate();
      } else if (op) {
        setOperator(op);
      }
    });
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('calc-display')) return;

    const key = e.key;
    if (/[0-9.]/.test(key)) {
      e.preventDefault();
      appendNumber(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
      e.preventDefault();
      setOperator(key);
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      calculate();
    } else if (key === 'Backspace') {
      e.preventDefault();
      deleteLastChar();
    } else if (key.toLowerCase() === 'c') {
      e.preventDefault();
      clear();
    }
  });

  // Initialize display
  updateDisplay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator);
} else {
  initCalculator();
}
