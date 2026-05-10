import { showToast } from './toast.js';

const ERR_COLOR = '#f87171';

function parseInput() {
  return document.getElementById('json-input');
}
function getOutput() {
  return document.getElementById('json-output');
}

function applyResult(text, isError = false) {
  const out = getOutput();
  if (!out) return;
  out.textContent = text;
  out.style.color = isError ? ERR_COLOR : 'var(--text)';
}

window.formatJSON = function () {
  try {
    applyResult(JSON.stringify(JSON.parse(parseInput().value), null, 2));
  } catch (err) {
    applyResult(`✗ ${err.message}`, true);
  }
};

window.minifyJSON = function () {
  try {
    applyResult(JSON.stringify(JSON.parse(parseInput().value)));
  } catch (err) {
    applyResult(`✗ ${err.message}`, true);
  }
};

window.copyJSON = function () {
  const text = getOutput()?.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => showToast('JSON copied!'));
};
