import os
from flask import Flask, jsonify, send_from_directory
from .scrapers import steamdb, steam_store

# Project root — the parent directory of this app/ package
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def register_routes(app: Flask) -> None:

    @app.route("/api/steam-free-games")
    def steam_free_games():
        # 1. Try SteamDB (richest data)
        games, err = steamdb.scrape()
        if games:
            return jsonify({"games": games, "error": None, "source": "steamdb"})

        # 2. Fall back to Steam store search
        fallback = steam_store.fetch()
        if fallback:
            return jsonify({
                "games":  fallback,
                "error":  None,
                "note":   "Loaded from Steam Store (SteamDB was unavailable).",
                "source": "steam",
            })

        # 3. Both failed
        if err == "cf_blocked":
            return jsonify({
                "error":      "SteamDB is Cloudflare-protected and no active promotions "
                              "were found via the Steam Store.",
                "cf_blocked": True,
                "games":      [],
            })

        return jsonify({"error": err or "No free promotions found right now.", "games": []})

    # ── Static file serving ───────────────────────────────────────────────────
    @app.route("/")
    def index():
        return send_from_directory(BASE_DIR, "index.html")

    @app.route("/<path:path>")
    def static_files(path):
        full = os.path.join(BASE_DIR, path)
        if os.path.isfile(full):
            return send_from_directory(BASE_DIR, path)
        return send_from_directory(BASE_DIR, "index.html")
