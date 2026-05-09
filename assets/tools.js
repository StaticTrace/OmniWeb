/* assets/tools.js
   Lightweight, dependency-free implementations for Quick Tools.
   Encapsulated to avoid global collisions.
*/
(function () {
  'use strict';

  // Helpers
  function $(id) { return document.getElementById(id); }
  function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  async function copyTextFromElement(targetId) {
    const el = $(targetId);
    if (!el) return;
    const text = (el.value !== undefined && el.value !== '') ? el.value : el.textContent || '';
    try { await navigator.clipboard.writeText(text); showToast('Copied'); }
    catch (e) { showToast('Copy failed'); }
  }
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    // trigger animation
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => t.classList.remove('visible'), 1400);
    setTimeout(() => t.remove(), 1800);
  }

  // Text counter
  function updateTextStats() {
    const el = $('text-input');
    if (!el) return;
    const text = el.value || '';
    $('char-count').textContent = `Chars: ${text.length}`;
    const words = text.trim().length ? text.trim().split(/\s+/).length : 0;
    $('word-count').textContent = `Words: ${words}`;
    const lines = text.length ? text.split(/\r?\n/).length : 0;
    $('line-count').textContent = `Lines: ${lines}`;
  }

  // Password generator
  function generatePassword(length, opts) {
    const sets = [];
    if (opts.lower) sets.push('abcdefghijklmnopqrstuvwxyz');
    if (opts.upper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (opts.digits) sets.push('0123456789');
    if (opts.symbols) sets.push('!@#$%^&*()-_=+[]{};:,.<>?');
    if (!sets.length) return '';
    const all = sets.join('');
    const arr = new Uint32Array(length);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, n => all[n % all.length]).join('');
  }

  // Name generator lists (small, extendable)
  const maleFirst = ['Liam','Noah','Oliver','Ethan','Haruto'];
  const femaleFirst = ['Emma','Olivia','Ava','Sofia','Yui'];
  const lastNames = ['Sato','Suzuki','Takahashi','Tanaka','Watanabe'];

  // Safe calculator
  function safeEvaluate(expr) {
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) return 'Invalid characters';
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${expr})`);
      const result = fn();
      if (typeof result === 'number' && isFinite(result)) return result;
      return 'Invalid expression';
    } catch (e) {
      return 'Error';
    }
  }

  // JSON formatter
  function formatJsonInput(indent, minify = false) {
    const input = $('json-input').value || '';
    try {
      const parsed = JSON.parse(input);
      $('json-output').textContent = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
    } catch (e) {
      $('json-output').textContent = `JSON parse error: ${e.message}`;
    }
  }

  // Clear helpers
  function clearTextInput() {
    const el = $('text-input');
    if (!el) return;
    el.value = '';
    updateTextStats();
  }

  // Event wiring
  document.addEventListener('DOMContentLoaded', function () {
    // Text counter
    const textInput = $('text-input');
    if (textInput) {
      textInput.addEventListener('input', updateTextStats);
      updateTextStats();
    }
    const textClear = $('text-clear');
    if (textClear) textClear.addEventListener('click', clearTextInput);

    // Password generator
    const pwGenBtn = $('pw-gen');
    if (pwGenBtn) {
      pwGenBtn.addEventListener('click', function () {
        const length = Math.max(4, Math.min(64, Number($('pw-length').value) || 16));
        const opts = {
          lower: $('pw-lower').checked,
          upper: $('pw-upper').checked,
          digits: $('pw-digits').checked,
          symbols: $('pw-symbols').checked
        };
        $('pw-output').value = generatePassword(length, opts);
      });
    }

    // Name generator
    const nameGenBtn = $('name-gen');
    if (nameGenBtn) {
      nameGenBtn.addEventListener('click', function () {
        const gender = $('name-gender').value;
        let first;
        if (gender === 'male') first = randFrom(maleFirst);
        else if (gender === 'female') first = randFrom(femaleFirst);
        else first = Math.random() < 0.5 ? randFrom(maleFirst) : randFrom(femaleFirst);
        const last = randFrom(lastNames);
        $('name-output').textContent = `${first} ${last}`;
      });
    }

    // Calculator
    const calcBtn = $('calc-eval');
    if (calcBtn) {
      calcBtn.addEventListener('click', function () {
        const expr = $('calc-input').value || '';
        $('calc-output').textContent = safeEvaluate(expr);
      });
      const calcInput = $('calc-input');
      if (calcInput) {
        calcInput.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); calcBtn.click(); }
        });
      }
    }

    // JSON formatter
    const jsonFormatBtn = $('json-format');
    const jsonMinifyBtn = $('json-minify');
    if (jsonFormatBtn) {
      jsonFormatBtn.addEventListener('click', function () {
        const indent = Math.max(0, Math.min(8, Number($('json-indent').value) || 2));
        formatJsonInput(indent, false);
      });
    }
    if (jsonMinifyBtn) {
      jsonMinifyBtn.addEventListener('click', function () { formatJsonInput(0, true); });
    }

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-copy-target');
        if (target) copyTextFromElement(target);
      });
    });
  });

})();
