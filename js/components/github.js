/**
 * GitHub Activity Widget - Displays recent GitHub activity
 */

const ghUserInput = document.getElementById('gh-user');
const ghLoadBtn = document.getElementById('gh-load');
const ghEventsList = document.getElementById('gh-events');

if (ghLoadBtn) {
  ghLoadBtn.addEventListener('click', loadGitHubActivity);
}

if (ghUserInput) {
  ghUserInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadGitHubActivity();
  });
}

async function loadGitHubActivity() {
  if (!ghUserInput || !ghEventsList) return;

  const username = ghUserInput.value.trim();
  if (!username) return;

  ghLoadBtn.textContent = 'Loading...';
  ghLoadBtn.disabled = true;
  ghEventsList.innerHTML = '<li class="pulse muted">Loading activity...</li>';

  try {
    const events = await safeFetch(
      `https://api.github.com/users/${username}/events/public?per_page=10`
    );

    if (!events.length) {
      ghEventsList.innerHTML = '<li class="muted">No recent activity found.</li>';
      return;
    }

    ghEventsList.innerHTML = events
      .map((event) => {
        const eventType = event.type.replace(/([A-Z])/g, ' $1').trim();
        const repo = event.repo?.name || 'unknown';
        const createdAt = new Date(event.created_at).toLocaleDateString();
        return `
          <li>
            <strong>${eventType}</strong> on
            <code>${repo}</code>
            <span class="muted"> (${createdAt})</span>
          </li>
        `;
      })
      .join('');
  } catch (error) {
    ghEventsList.innerHTML = `<li class="error">${error.message}</li>`;
  } finally {
    ghLoadBtn.textContent = 'Load';
    ghLoadBtn.disabled = false;
  }
}

// Load default user on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadGitHubActivity);
} else {
  loadGitHubActivity();
}
