# OmniWeb

A lightweight, zero-dependency personal website and dashboard template with live widgets.

## Features
- ✨ **No Dependencies** — Pure HTML, CSS & Vanilla JS
- 🌙 **Dark/Light Mode** with localStorage persistence
- 📱 **Fully Responsive** (mobile-first)
- ⚡ **Extremely Fast** — Minimal footprint
- 🛠 **Tools Page** with 5 client-side utilities
- ♿ **Accessible** — Semantic HTML + focus styles

## Live Demo
https://StaticTrace.github.io/OmniWeb

## Project Structure (Flat Root)
All files are in the **root directory**:

OmniWeb/
├── *.html              # index, dashboard, tools, vault, etc.
├── style.css           # All styles (consolidated)
├── script.js           # Core JS + widgets
├── tools.js            # Optional: Tool utilities
├── calculator.js       # etc.
├── README.md
├── .nojekyll
└── (support files)


## Getting Started
1. Clone: `git clone https://github.com/StaticTrace/OmniWeb.git`
2. Serve locally:
   ```bash
   python -m http.server 8000
   # or
   npx http-server

Tools

Text Counter
Secure Password Generator (crypto.getRandomValues)
Random Name Generator
Calculator
JSON Formatter

License
MIT
Built by @StaticTrace