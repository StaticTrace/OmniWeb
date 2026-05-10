import { showToast } from './toast.js';

const CHARS = {
  lower:   'abcdefghijklmnopqrstuvwxyz',
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

let currentPassword = '';

window.generatePassword = function () {
  const length         = Math.min(64, Math.max(8, parseInt(document.getElementById('pw-length')?.value || '16', 10)));
  const includeNumbers = document.getElementById('include-numbers')?.checked;
  const includeSymbols = document.getElementById('include-symbols')?.checked;

  let pool = CHARS.lower + CHARS.upper;
  if (includeNumbers) pool += CHARS.numbers;
  if (includeSymbols) pool += CHARS.symbols;

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  currentPassword = Array.from(arr, v => pool[v % pool.length]).join('');

  const out = document.getElementById('password-output');
  if (out) out.value = currentPassword;
};

window.copyPassword = function () {
  if (!currentPassword) window.generatePassword();
  navigator.clipboard.writeText(currentPassword).then(() => showToast('Password copied!'));
};
