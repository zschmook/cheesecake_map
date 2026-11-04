# Cheesecake Election Map

Run `docker compose up -d --build` and open http://localhost:8090.

Senate: national county returns for 2026 Senate races; states without a race and counties without returns remain gray. House: 2026 congressional districts, colored by the current vote leader. All 220 restaurant points remain visible. Scroll to zoom and drag to pan. Hover for votes or restaurant addresses.

The Node server polls civicAPI's public national Senate (87528) and House (87524) race endpoints every 300 seconds, then loads county breakdowns for Senate races that have votes. Four concurrent requests maximum; 25-second request timeout. Errors retain previous successful data, with a delayed/stale label. The browser reads the server cache every five minutes; visiting the app does not trigger upstream API requests. The cache persists in a Docker volume. No external JavaScript dependencies or API keys.

Data: civicAPI (https://civicapi.org/api-documentation), its 2026 House geography, US Atlas county/state geometry, and the official Cheesecake Factory directory as collected November 3, 2026. Current restaurant locations are not a historical 2026-election-day opening audit. Early leads are not race calls. Senate special races may overlap regular races: where both report the same county, the last returned race is displayed. Alaska district and Connecticut planning-region returns are not falsely assigned to older county boundaries.
