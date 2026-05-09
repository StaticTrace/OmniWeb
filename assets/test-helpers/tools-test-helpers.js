// This file is optional and only needed if you run the tests above in Node.
// It mirrors the browser functions in a testable way.

function generatePassword(length, opts) {
    const sets = [];
    if (opts.lower) sets.push('abcdefghijklmnopqrstuvwxyz');
    if (opts.upper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (opts.digits) sets.push('0123456789');
    if (opts.symbols) sets.push('!@#$%^&*()-_=+[]{};:,.<>?');
    if (!sets.length) return '';
    const all = sets.join('');
    // Use a simple RNG for tests (not crypto)
    let out = '';
    for (let i = 0; i < length; i++) {
      out += all[Math.floor(Math.random() * all.length)];
    }
    return out;
  }
  
  function formatJsonInputForTest(input, indent = 2, minify = false) {
    try {
      const parsed = JSON.parse(input);
      return minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent);
    } catch (e) {
      return `JSON parse error: ${e.message}`;
    }
  }
  
  module.exports = { generatePassword, formatJsonInputForTest };
  