# Play It Again Sports San Diego TV

Open https://piassandiego.github.io/pias-sd-tv/ on your TV. Videos loop automatically, muted. The ticker (black band, pink edge) sits outside the video so it never hides the store footer. Click the screen or press **F** for full screen (if the browser supports it).

## TV options
- **Fire TV Stick:** install/open the Silk browser and enter the address. Bookmark it and use its full-screen option if available.
- **Chromecast / Google TV:** use a browser app on the device, or cast a Chrome tab from a computer. A regular Chromecast needs another device to cast from.
- **Smart TV:** open the built-in browser and enter the address. Older TVs may not support this player; a streaming stick or mini PC is more reliable.
- **Mini PC:** open the address in Chrome or Edge full-screen/kiosk mode. Disable sleep and screensavers.

Keep the device online. It refreshes every four hours to pick up changes. Refresh manually to see them sooner. Remote-control clicks can sometimes be handled by the TV rather than the page.

## Change the ticker or playlist
1. On github.com, open **piassandiego/pias-sd-tv** and select **config.js**.
2. Click the pencil icon. Edit the words inside quotes, keeping the commas and brackets.
3. Click **Commit changes**. Wait about a minute for GitHub Pages to publish (occasionally longer), then refresh the TV, or wait for its automatic refresh.

`config.js` has examples and comments. Move whole playlist lines to reorder them; delete a line to remove an item. Upload new videos into **videos/** or photos into **images/** using **Add file → Upload files**, then add their paths to the playlist. Photos need `type: 'image'` and `duration` in seconds. Keep file names lowercase with hyphens and no spaces. Each uploaded file must stay below **24 MB** for this upload workflow.

Change `tickerSpeed` for faster/slower scrolling; `tickerPosition` can be `'bottom'` or `'top'`. Change `reloadHours` for the automatic refresh interval, or use 0 to disable it. Leave the HTML, CSS and player files alone for normal content changes.

No sound is intentional: browsers require muted playback for reliable autoplay. A browser's first visit or device power-saving settings may still require a click. If playback stops, refresh and check Wi-Fi. Missing/broken media are skipped automatically.

## Live info slides (weather, snow, surf)
- `live.js` draws `{ type: 'live', widget: '...' }` slides from `data/weather.json`, `data/snow-socal.json`, `data/snow-west.json`, `data/surf.json`.
- `.github/workflows/update-data.yml` runs `scripts/update_data.py` every 30 minutes (and from the Actions tab → Run workflow) and commits the JSON only when it changed. NOAA buoy files block browser requests, so data is fetched server-side.
- Sources (public domain, free): National Weather Service (api.weather.gov), NOAA NDBC / CDIP buoys, USDA NRCS SNOTEL snow depth. Snow numbers are mountain weather, not official resort reports.
- If a data file is missing or broken, that slide is skipped automatically.
