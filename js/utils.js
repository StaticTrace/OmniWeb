// Shared utility functions — no side effects, no DOM access

export function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  
  export function timeAgo(date) {
    const s = Math.floor((Date.now() - date) / 1000);
    if (s < 60)    return 'just now';
    if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  }
  
  export function capitalize(s) {
    return s ? s[0].toUpperCase() + s.slice(1) : '';
  }
  
  // Returns today's date as YYYY-MM-DD
  export function isoToday() {
    return new Date().toISOString().slice(0, 10);
  }
  
  // Returns a date offset by `days` from the given ISO date string
  export function isoOffset(base, days) {
    const d = new Date(base + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }
  
  // Safe localStorage helpers — parse errors return the fallback
  export function storageGet(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  
  export function storageSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  export function storageRemove(key) {
    localStorage.removeItem(key);
  }
  
  export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  }
  