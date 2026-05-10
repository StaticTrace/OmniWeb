import re
import requests
from bs4 import BeautifulSoup
from ..config import STEAM_SEARCH_URL, STEAM_DETAILS_URL, BROWSER_HEADERS


def _app_details(app_id: str) -> dict:
    """Fetch lightweight app details from Steam store API."""
    try:
        r = requests.get(
            STEAM_DETAILS_URL,
            params={"appids": app_id, "cc": "us", "l": "en",
                    "filters": "basic,price_overview,release_date"},
            headers=BROWSER_HEADERS,
            timeout=10,
        )
        data     = r.json()
        app_data = data.get(app_id, {})
        return app_data.get("data", {}) if app_data.get("success") else {}
    except Exception:
        return {}


def _classify(app_id: str, discount_pct: int) -> tuple[str, str]:
    """Return (type_str, end_time). Falls back to discount heuristic."""
    details = _app_details(app_id)
    if not details:
        return ("Free to Keep" if discount_pct == 100 else "Free Weekend"), ""

    free_weekend = details.get("free_weekend")
    if free_weekend:
        end_ts = free_weekend.get("end_date", "")
        return "Free Weekend", str(end_ts) if end_ts else ""

    if details.get("is_free") and discount_pct == 100:
        return "Free to Keep", ""

    return ("Free to Keep" if discount_pct == 100 else "Free Weekend"), ""


def _parse_search_html(html: str) -> list[dict]:
    """Extract raw game rows from Steam search results page."""
    soup  = BeautifulSoup(html, "lxml")
    games = []

    for row in soup.find_all(class_=lambda c: c and "search_result_row" in c):
        app_id = row.get("data-ds-appid", "")
        if not app_id:
            m      = re.search(r"/app/(\d+)/", row.get("href", ""))
            app_id = m.group(1) if m else ""
        if not app_id:
            continue

        name_el = row.select_one(".title")
        if not name_el:
            continue

        discount_el  = row.select_one("[data-discount]")
        discount_pct = int(discount_el.get("data-discount", 0)) if discount_el else 0
        orig_el      = row.select_one(".discount_original_price")
        had_price    = orig_el and orig_el.get_text(strip=True) not in ("", "Free to Play")

        if not had_price:
            continue

        games.append({
            "app_id":       app_id,
            "name":         name_el.get_text(strip=True),
            "discount_pct": discount_pct,
        })

    return games


def fetch() -> list[dict]:
    """Fetch temporarily-free games from Steam store search, enriched with type info."""
    try:
        r = requests.get(STEAM_SEARCH_URL, headers=BROWSER_HEADERS, timeout=15)
        r.raise_for_status()
        raw = _parse_search_html(r.text)
    except Exception:
        return []

    games = []
    for g in raw[:20]:
        game_type, end_time = _classify(g["app_id"], g["discount_pct"])
        games.append({
            "name":       g["name"],
            "type":       game_type,
            "start_time": "",
            "end_time":   end_time,
            "app_id":     g["app_id"],
            "source":     "steam",
        })
    return games
