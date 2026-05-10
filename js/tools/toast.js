export function showToast(msg) {
    let toast = document.getElementById('ow-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ow-toast';
      toast.style.cssText = [
        'position:fixed;bottom:24px;right:24px;background:#22c55e;color:white',
        'padding:10px 18px;border-radius:8px;font-size:0.88rem;font-weight:600',
        'z-index:9999;opacity:0;transition:opacity 0.2s ease',
        'font-family:Inter,system-ui,sans-serif',
      ].join(';');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
  }
  