# OmniWeb

A lightweight, zero-dependency personal website and dashboard template with live widgets.

## Features

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

## Tech Stack

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

## Future Plans

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
