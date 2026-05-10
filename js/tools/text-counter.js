export function init() {
    const textarea = document.getElementById('text-input');
    const stats    = document.getElementById('text-stats');
    if (!textarea || !stats) return;
  
    function update() {
      const text         = textarea.value;
      const words        = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars        = text.length;
      const charsNoSpace = text.replace(/\s/g, '').length;
      const lines        = text ? text.split('\n').length : 0;
      const readTime     = Math.max(1, Math.ceil(words / 200));
      stats.innerHTML =
        `Words: <strong>${words}</strong> &nbsp;|&nbsp; ` +
        `Chars: <strong>${chars}</strong> &nbsp;|&nbsp; ` +
        `No spaces: <strong>${charsNoSpace}</strong> &nbsp;|&nbsp; ` +
        `Lines: <strong>${lines}</strong> &nbsp;|&nbsp; ` +
        `~${readTime} min read`;
    }
  
    textarea.addEventListener('input', update);
    update();
  }
  