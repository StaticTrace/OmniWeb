// GitHub Activity Widget
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
    const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=10`);

    if (!response.ok) {
      throw new Error('User not found or API rate limited');
    }

    const events = await response.json();

    if (!events.length) {
      ghEventsList.innerHTML = '<li class="muted">No recent activity found.</li>';
      return;
    }

    ghEventsList.innerHTML = events
      .map((event) => {
        const eventType = event.type.replace(/([A-Z])/g, ' $1').trim();
        const repo = event.repo?.name || 'unknown';
        const createdAt = new Date(event.created_at).toLocaleDateString();
        return `<li><strong>${eventType}</strong> on <code style="background: var(--clr-bg); padding: 2px 4px; border-radius: 3px; font-size: 0.8em;">${repo}</code> (${createdAt})</li>`;
      })
      .join('');
  } catch (error) {
    ghEventsList.innerHTML = `<li style="color: #ef4444;">${error.message}</li>`;
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
