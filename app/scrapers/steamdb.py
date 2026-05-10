import re
import cloudscraper
from bs4 import BeautifulSoup
from ..config import STEAMDB_URL, BROWSER_HEADERS


def _parse_html(html: str) -> list[dict]:
    soup  = BeautifulSoup(html, "lxml")
    games = []

    # Primary: elements with a data-appid attribute
    for el in soup.select("[data-appid]"):
        app_id = el.get("data-appid", "").strip()
        if not app_id:
            continue

        name_el = el.select_one(".app-name, h2, h3, strong, td a, a")
        name    = name_el.get_text(strip=True) if name_el else f"App {app_id}"
        if len(name) < 2:
            continue

        game_type = "Free Weekend"
        for text in el.stripped_strings:
            if "keep" in text.lower():
                game_type = "Free to Keep"
                break

        times      = el.select("[data-time]")
        start_time = times[0].get("data-time", "") if len(times) >= 1 else ""
        end_time   = times[1].get("data-time", "") if len(times) >= 2 else ""

        if any(g["app_id"] == app_id for g in games):
            continue
        games.append({
            "name": name, "type": game_type,
            "start_time": start_time, "end_time": end_time,
            "app_id": app_id, "source": "steamdb",
        })

    # Fallback: <table> rows
    if not games:
        for row in soup.select("table tr"):
            cells = row.select("td")
            if len(cells) < 2:
                continue
            link = cells[0].select_one("a[href*='/app/']")
            if not link:
                continue
            m = re.search(r"/app/(\d+)/", link.get("href", ""))
            if not m:
                continue
            app_id = m.group(1)
            if any(g["app_id"] == app_id for g in games):
                continue

            name      = cells[0].get_text(strip=True)
            raw_type  = cells[1].get_text(strip=True) if len(cells) > 1 else ""
            game_type = "Free to Keep" if "keep" in raw_type.lower() else "Free Weekend"

            def _time(cell):
                t = cell.select_one("[data-time]")
                return t.get("data-time", cell.get_text(strip=True)) if t else cell.get_text(strip=True)

            games.append({
                "name": name, "type": game_type,
                "start_time": _time(cells[2]) if len(cells) > 2 else "",
                "end_time":   _time(cells[3]) if len(cells) > 3 else "",
                "app_id": app_id, "source": "steamdb",
            })

    return games


def scrape() -> tuple[list[dict] | None, str | None]:
    """
    Returns (games, error).
    games is None on hard failure; error is None on success.
    """
    try:
        scraper = cloudscraper.create_scraper(
            browser={"browser": "chrome", "platform": "windows", "mobile": False},
            delay=3,
        )
        resp = scraper.get(STEAMDB_URL, headers=BROWSER_HEADERS, timeout=20)
        if resp.status_code == 403:
            return None, "cf_blocked"
        if resp.status_code != 200:
            return None, f"HTTP {resp.status_code}"
        return _parse_html(resp.text), None
    except Exception as exc:
        return None, str(exc)
