# OmniWeb

OmniWeb is a lightweight static starter site for prototyping UI components, portfolios, dashboards, and small web projects.

---

## Quick Tools

A new client-side utilities page has been added at **/tools.html**. It contains five mini-utilities:

- **Text counter** — counts characters, words, and lines in real time.
- **Password generator** — secure random passwords using `crypto.getRandomValues`.
- **Random name generator** — small, extendable lists for first and last names.
- **Simple calculator** — evaluates basic arithmetic expressions safely.
- **JSON formatter** — validates and pretty-prints JSON; shows parse errors.

### Files added
- `/tools.html` — Tools page with five sections and navigation anchors.
- `/assets/tools.js` — Client-side logic for all tools (no external dependencies).
- `/assets/tools.css` — Styles specific to the tools page.

### Files updated
- `/components/header.html` — navigation updated to include a Tools link.
- `/assets/styles.css` — small global rules added/merged to ensure consistent focus styles and helper classes.

---

## How to test locally

1. Serve the repository with a static server (for example `npx http-server` or `python -m http.server`) or open `tools.html` directly in a browser.
2. Open `/tools.html` and exercise each tool:
   - Paste text into the Text counter and verify counts update.
   - Generate passwords with different options and copy to clipboard.
   - Generate names and copy results.
   - Enter arithmetic expressions in the calculator and press Calculate or Enter.
   - Paste JSON into the JSON formatter and press Format or Minify.
3. Verify keyboard navigation and focus outlines for accessibility.

---

## Integration notes

- The tools page is **client-side only**; it does not send data to any server.
- If you maintain a single global stylesheet, merge `/assets/tools.css` into `/assets/styles.css` or import it from your main CSS.
- Ensure `/components/header.html` is included in your templates so the Tools link appears site-wide.

---

## Security & accessibility

- Password generator uses `window.crypto.getRandomValues` for secure randomness.
- Controls include labels and `aria-live` regions for dynamic outputs.
- Do not store secrets or credentials in client-side code.

---

## Contribution

To extend the tools:
- Add locale-specific name lists in `/assets/tools.js`.
- Add unit tests for `generatePassword` and `formatJsonInput` if you use CI.
- Improve styling in `/assets/tools.css` to match your site theme.
