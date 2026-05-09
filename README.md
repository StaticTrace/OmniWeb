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

## Tools Page

A client-side utilities page at `/tools.html` with:
- **Text counter** — counts characters, words, and lines in real time.
- **Password generator** — secure random passwords using `crypto.getRandomValues`.
- **Random name generator** — small, extendable lists.
- **Simple calculator** — evaluates basic arithmetic expressions safely.
- **JSON formatter** — validates and pretty-prints JSON.

## Project Structure

```
OmniWeb/
├── css/                  # Stylesheets
├── js/                   # JavaScript (main, utils, components)
├── assets/               # Additional assets and tools
├── includes/             # Reusable HTML snippets
├── *.html                # Main pages (index, dashboard, tools, etc.)
└── README.md
```

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/StaticTrace/OmniWeb.git
   cd OmniWeb
   ```

2. Serve with a static server:
   ```bash
   # Python
   python -m http.server 8000

   # Node
   npx http-server
   ```

3. Open `http://localhost:8000`

### GitHub Pages

Enable GitHub Pages in repo settings. Site available at `https://StaticTrace.github.io/OmniWeb`.

## Customization

Edit CSS variables in `css/variables.css` and add components in `js/components/`.

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- APIs: Open-Meteo, GitHub REST

## License

MIT License

Built by [@StaticTrace](https://github.com/StaticTrace)

Contributions welcome!