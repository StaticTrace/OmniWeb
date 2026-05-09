// Simple GitHub activity feed (public events). No auth used.
// Enter a username in the input; default is "octocat".
(function () {
    const input = document.getElementById('gh-user');
    const btn = document.getElementById('gh-load');
    const list = document.getElementById('gh-events');
  
    async function loadEvents(username) {
      if (!username) return;
      list.innerHTML = '<li class="muted">Loading…</li>';
      try {
        const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public`);
        if (!res.ok) {
          list.innerHTML = `<li class="muted">Unable to fetch events for ${username}.</li>`;
          return;
        }
        const events = await res.json();
        if (!Array.isArray(events) || events.length === 0) {
          list.innerHTML = `<li class="muted">No recent public activity for ${username}.</li>`;
          return;
        }
  
        const items = events.slice(0, 6).map(ev => {
          const when = new Date(ev.created_at).toLocaleString();
          const type = ev.type.replace(/Event$/, '');
          let repo = ev.repo && ev.repo.name ? ev.repo.name : '';
          let text = `${type} ${repo}`.trim();
          // Provide a short readable message for common event types
          if (ev.type === 'PushEvent' && ev.payload && ev.payload.commits) {
            const c = ev.payload.commits[0];
            const msg = c && c.message ? `: ${c.message}` : '';
            text = `Push to ${repo}${msg}`;
          } else if (ev.type === 'CreateEvent') {
            text = `Created ${ev.payload.ref_type} ${ev.payload.ref || ''} in ${repo}`.trim();
          } else if (ev.type === 'IssuesEvent') {
            text = `${ev.payload.action} issue in ${repo}`;
          } else if (ev.type === 'PullRequestEvent') {
            text = `${ev.payload.action} PR in ${repo}`;
          }
          return `<li><strong>${escapeHtml(text)}</strong><div class="muted">${escapeHtml(when)}</div></li>`;
        }).join('');
        list.innerHTML = items;
      } catch (err) {
        console.error(err);
        list.innerHTML = '<li class="muted">Error loading GitHub activity.</li>';
      }
    }
  
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (m) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
      });
    }
  
    document.addEventListener('DOMContentLoaded', () => {
      const defaultUser = input && input.value ? input.value.trim() : 'octocat';
      loadEvents(defaultUser);
    });
  
    if (btn) {
      btn.addEventListener('click', () => {
        const user = input.value.trim();
        loadEvents(user);
      });
    }
  })();
  