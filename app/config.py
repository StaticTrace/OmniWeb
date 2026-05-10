STEAMDB_URL      = "https://steamdb.info/upcoming/free/"
STEAM_SEARCH_URL = (
    "https://store.steampowered.com/search/results/"
    "?maxprice=free&specials=1&count=50&cc=us&l=en"
)
STEAM_DETAILS_URL = "https://store.steampowered.com/api/appdetails"

# Realistic browser headers used for every outbound request
BROWSER_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}
