import { timeAgo, capitalize } from '../utils.js';
import { GITHUB_USERNAME } from '../core.js';

const EVENT_FORMAT = {
  PushEvent:         p => ({ icon: '⬆️', label: `Pushed ${p.commits?.length || 1} commit(s)` }),
  CreateEvent:       p => ({ icon: '✨', label: `Created ${p.ref_type} ${p.ref || ''}` }),
  DeleteEvent:       p => ({ icon: '🗑️', label: `Deleted ${p.ref_type} ${p.ref || ''}` }),
  PullRequestEvent:  p => ({ icon: '🔀', label: `${capitalize(p.action)} pull request` }),
  IssuesEvent:       p => ({ icon: '🐛', label: `${capitalize(p.action)} issue` }),
  IssueCommentEvent: _  => ({ icon: '💬', label: 'Commented on issue' }),
  WatchEvent:        _  => ({ icon: '⭐', label: 'Starred' }),
  ForkEvent:         _  => ({ icon: '🍴', label: 'Forked' }),
  ReleaseEvent:      p => ({ icon: '🚀', label: `Released ${p.release?.tag_name || ''}` }),
};

function formatEvent(type, payload) {
  const formatter = EVENT_FORMAT[type];
  return formatter ? formatter(payload) : { icon: '📌', label: type.replace('Event', '') };
}

export function init() {
  const el = document.getElementById('github-widget');
  if (!el) return;

  el.innerHTML = '<p class="widget-loading">Loading activity…</p>';

  fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`)
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(events => {
      if (!events.length) {
        el.innerHTML = '<p class="widget-muted">No recent public activity.</p>';
        return;
      }
      const items = events.slice(0, 7).map(ev => {
        const { type, repo, created_at, payload } = ev;
        const repoName = repo.name.split('/')[1];
        const repoUrl  = `https://github.com/${repo.name}`;
        const { icon, label } = formatEvent(type, payload);
        return `
          <div class="gh-event">
            <span class="gh-icon">${icon}</span>
            <div class="gh-details">
              <span class="gh-label">${label}</span>
              <a class="gh-repo" href="${repoUrl}" target="_blank" rel="noopener">${repoName}</a>
            </div>
            <span class="gh-time">${timeAgo(new Date(created_at))}</span>
          </div>`;
      }).join('');
      el.innerHTML = `
        <div class="gh-feed">${items}</div>
        <a class="gh-profile-link" href="https://github.com/${GITHUB_USERNAME}"
           target="_blank" rel="noopener">View GitHub Profile →</a>`;
    })
    .catch(() => {
      el.innerHTML = `<p class="widget-muted">Could not load GitHub activity for <strong>${GITHUB_USERNAME}</strong>.</p>`;
    });
}
