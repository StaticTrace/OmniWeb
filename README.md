# OmniWeb

<<<<<<< HEAD
OmniWeb is a lightweight static starter site for prototyping UI components, portfolios, dashboards, and small web projects.
=======
A lightweight, zero-dependency personal website and dashboard template with live widgets.
>>>>>>> 6ffaf6b5c8b6fa37da554f6762a5e4d6d6435a38

---

<<<<<<< HEAD
## Quick Tools
=======
- ✨ **No Dependencies** - Pure HTML, CSS, and JavaScript
- 🌙 **Dark Mode** - Built-in dark/light theme with localStorage persistence
- 📱 **Responsive Design** - Mobile-first, works on all devices
- ⚡ **Fast & Lightweight** - Minimal file sizes for quick loading
- 🎨 **Modern Design** - Clean, professional UI with smooth animations
- 🧩 **Modular** - Easy to customize and extend
- ♿ **Accessible** - WCAG-compliant with semantic HTML

## Live Widgets

- **Time Widget** - Real-time clock with date
- **Weather Widget** - Location-based weather using Open-Meteo API
- **GitHub Activity** - Recent GitHub activity for any user

## Project Structure

```
OmniWeb/
├── css/
│   ├── style.css           # Main stylesheet (imports all CSS)
│   ├── variables.css       # CSS variables for colors and spacing
│   ├── global.css          # Global styles and typography
│   ├── header.css          # Header and navigation styles
│   ├── footer.css          # Footer styles
│   ├── pages.css           # Page-specific styles
│   ├── dashboard.css       # Dashboard and card styles
│   ├── animations.css      # Keyframe animations
│   └── responsive.css      # Responsive breakpoints
├── js/
│   ├── main.js             # Core functionality (dark mode, menu, etc.)
│   ├── utils.js            # Utility functions
│   └── components/
│       ├── time.js         # Time widget
│       ├── weather.js      # Weather widget
│       └── github.js       # GitHub activity widget
├── includes/               # Reusable HTML snippets (reference only)
│   ├── header.html
│   └── footer.html
├── index.html              # Home page
├── about.html              # About page
├── projects.html           # Projects page
├── contact.html            # Contact page
├── dashboard.html          # Dashboard with widgets
└── README.md               # This file
```

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/StaticTrace/OmniWeb.git
cd OmniWeb
```

2. Use any local server (Python, Node, or your preferred method):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

3. Open `http://localhost:8000` in your browser

### GitHub Pages

To deploy on GitHub Pages:
1. Push to your `gh-pages` branch
2. Enable GitHub Pages in repository settings
3. Your site will be available at `https://<username>.github.io/OmniWeb`

## Customization

### Change Colors

Edit `css/variables.css` to customize the color scheme:

```css
:root {
  --clr-primary: #3b82f6;        /* Change primary color */
  --clr-secondary: #8b5cf6;      /* Change secondary color */
  --clr-accent: #ec4899;         /* Change accent color */
}
```

### Modify Layout

Edit the relevant HTML files or CSS files:
- Page content: `*.html` files
- Page styling: `css/pages.css`
- Dashboard: `dashboard.html` and `css/dashboard.css`

### Add New Widgets

1. Create a new JavaScript file in `js/components/`
2. Add HTML structure to `dashboard.html`
3. Add styling to `css/dashboard.css`
4. Import the script in `dashboard.html`
>>>>>>> 6ffaf6b5c8b6fa37da554f6762a5e4d6d6435a38

A client-side utilities page has been added at **/tools.html**. It contains five mini-utilities:

<<<<<<< HEAD
- **Text counter** — counts characters, words, and lines in real time.
- **Password generator** — secure random passwords using `crypto.getRandomValues`.
- **Random name generator** — small, extendable lists for first and last names.
- **Simple calculator** — evaluates basic arithmetic expressions safely.
- **JSON formatter** — validates and pretty-prints JSON; shows parse errors.
=======
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, grid, flexbox
- **JavaScript (Vanilla)** - No frameworks or libraries
- **APIs Used**:
  - Open-Meteo (Weather data)
  - OpenStreetMap Nominatim (Location reverse geocoding)
  - GitHub REST API (Activity data)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

Note: Requires ES6 support
>>>>>>> 6ffaf6b5c8b6fa37da554f6762a5e4d6d6435a38

### Files added
- `/tools.html` — Tools page with five sections and navigation anchors.
- `/assets/tools.js` — Client-side logic for all tools (no external dependencies).
- `/assets/tools.css` — Styles specific to the tools page.

<<<<<<< HEAD
### Files updated
- `/components/header.html` — navigation updated to include a Tools link.
- `/assets/styles.css` — global rules added/merged to ensure consistent focus styles and helper classes.

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
=======
- [ ] Blog system
- [ ] Advanced dashboard widgets
- [ ] Authentication support
- [ ] More API integrations
- [ ] Portfolio section
- [ ] SEO optimization

## License

MIT License - feel free to use this project for your own needs.

## Credits

Built by [@StaticTrace](https://github.com/StaticTrace)

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Repository:** https://github.com/StaticTrace/OmniWeb
>>>>>>> 6ffaf6b5c8b6fa37da554f6762a5e4d6d6435a38
