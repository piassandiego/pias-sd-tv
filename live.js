// Live info slides (weather, snow, surf). Data comes from data/*.json, which the
// GitHub Action in .github/workflows/update-data.yml refreshes every 30 minutes
// from National Weather Service, NOAA/CDIP buoys and USDA SNOTEL (all public domain).
// If a data file is missing or broken, render() resolves false and the slide is skipped.
(() => {
  'use strict';
  const CACHE_MS = 30 * 60 * 1000;
  const SURFLINE_QR = 'images/qr-surfline-san-diego.png';
  const esc = v => String(v == null ? '' : v).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const time = iso => new Date(iso).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles'});
  const memo = {};
  async function load(name) {
    const key = 'tv-live-' + name, now = Date.now();
    let hit = memo[name];
    if (!hit) { try { hit = JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { hit = null; } }
    if (hit && now - hit.at < CACHE_MS && hit.data) return hit.data;
    try {
      const res = await fetch('data/' + name + '.json?t=' + Math.floor(now / CACHE_MS), {cache: 'no-cache'});
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      memo[name] = {at: now, data};
      try { localStorage.setItem(key, JSON.stringify(memo[name])); } catch (_) {}
      return data;
    } catch (e) {
      // Fall back to cached data up to 6 hours old, otherwise skip the slide.
      if (hit && now - hit.at < 6 * 3600000 && hit.data) return hit.data;
      throw e;
    }
  }
  const header = (kicker, title, d) => `<header class="live-head"><div><div class="live-kicker">${esc(kicker)}</div>
    <h1>${esc(title)}</h1></div><div class="live-updated">Updated ${esc(time(d.updated))}</div></header>`;
  const n = v => (v == null || v === '' ? '–' : esc(v));

  const widgets = {
    weather(d) {
      const c = d.current, t = d.today;
      if (c.tempF == null || !d.outlook || !d.outlook.length) return null;
      return header(d.place, 'Weather at the store', d) + `<div class="wx-main">
        <div class="wx-now"><div class="wx-temp">${n(c.tempF)}°</div><div class="wx-text">${n(c.text)}</div></div>
        <div class="wx-facts"><div><span>Today</span><b>${n(t.high)}° / ${n(t.low)}°</b></div>
        <div><span>Wind</span><b>${n(c.windDir)} ${n(c.windMph)} mph</b></div>
        ${c.humidity != null ? `<div><span>Humidity</span><b>${n(c.humidity)}%</b></div>` : ''}</div></div>
        <div class="wx-days">${d.outlook.slice(0, 3).map(x => `<div class="card"><div class="day">${n(x.name)}</div>
        <div class="hilo"><b>${n(x.high)}°</b> / ${n(x.low)}°</div><div class="short">${n(x.short)}</div></div>`).join('')}</div>
        <footer class="live-src">${esc(d.source)}${c.station ? ' · observed at ' + esc(c.station) : ''}</footer>`;
    },
    snow(d, title, kicker) {
      if (!d.resorts || !d.resorts.length) return null;
      const depth = d.resorts.some(r => r.snowDepthIn != null);
      return header(kicker, title, d) + `<table class="snow"><thead><tr><th>Resort</th><th>Now</th><th>Forecast</th>
        <th>Next 3 days</th>${depth ? '<th>Snow depth*</th>' : ''}</tr></thead><tbody>
        ${d.resorts.map(r => `<tr><td><b>${esc(r.name)}</b><small>${esc(r.area)}</small></td><td class="num">${n(r.tempF)}°</td>
        <td>${n(r.short)}</td><td class="num hot">${n(r.snow3dayIn)}"</td>${depth ? `<td class="num">${r.snowDepthIn != null ? esc(r.snowDepthIn) + '"' : '–'}</td>` : ''}</tr>`).join('')}
        </tbody></table><footer class="live-src">Mountain weather &amp; snowfall: National Weather Service (not official resort reports)${depth ? ' · *Snow depth: USDA NRCS SNOTEL station near resort' : ''}</footer>`;
    },
    'snow-socal': d => widgets.snow(d, 'SoCal snow report', 'Big Bear · Snow Valley · Mountain High'),
    'snow-west': d => widgets.snow(d, 'Western snow report', 'Mammoth · Tahoe · Utah'),
    surf(d) {
      if (!d.buoys || !d.buoys.length) return null;
      const water = d.buoys.map(b => b.waterF).find(v => v != null);
      return header('Buoys · wind at the beach', 'San Diego surf', d) + `<div class="surf">
        <table class="snow buoys"><thead><tr><th>Buoy</th><th>Waves</th><th>Period</th><th>Swell</th></tr></thead><tbody>
        ${d.buoys.slice(0, 4).map(b => `<tr><td><b>${esc(b.name)}</b></td><td class="num hot">${n(b.waveFt)} ft</td>
        <td class="num">${n(b.periodS)} s</td><td class="num">${n(b.dir)}</td></tr>`).join('')}</tbody></table>
        <div class="surf-side">${water != null ? `<div class="water"><span>Water</span><b>${esc(water)}°F</b></div>` : ''}
        <div class="spots">${(d.spots || []).map(s => `<div><span>${esc(s.name)}</span><b>${esc(s.windDir)} ${esc(s.windMph)} mph</b></div>`).join('')}</div>
        <div class="qr"><img src="${SURFLINE_QR}" alt=""><div>Full forecast:<br><b>Surfline San Diego</b></div></div></div></div>
        <footer class="live-src">${esc(d.source)}</footer>`;
    },
  };

  window.TV_LIVE = {
    async render(widget, el) {
      try {
        const fn = widgets[widget];
        if (!fn) return false;
        const html = fn(await load(widget));
        if (!html) return false;
        el.innerHTML = `<div class="live-inner live-${esc(widget)}">${html}</div>`;
        return true;
      } catch (e) { return false; }  // Silent skip on any failure.
    },
  };
})();
