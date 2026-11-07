(() => {
  'use strict';
  const cfg = window.TV_CONFIG || {};
  const list = (cfg.playlist || []).filter(item => item && (item.src || (item.type === 'live' && item.widget)));
  const live = window.TV_LIVE;
  const screen = document.getElementById('screen');
  const status = document.getElementById('status');
  if (cfg.tickerPosition === 'top') document.body.classList.add('ticker-top');
  const track = document.getElementById('ticker-track');
  const copy = document.createElement('div'); copy.className = 'ticker-copy';
  (cfg.tickerMessages || []).forEach(message => {
    const text = document.createElement('span'); text.textContent = message; copy.appendChild(text);
    const separator = document.createElement('span'); separator.className = 'separator';
    separator.textContent = '◆'; copy.appendChild(separator);
  });
  track.appendChild(copy);
  let animation;
  function sizeTicker() {
    if (animation) animation.cancel();
    while (track.children.length > 1) track.lastChild.remove();
    const width = copy.getBoundingClientRect().width;
    if (!width) return;
    for (let n = 0; n < Math.ceil(innerWidth / width) + 1; n++) {
      const clone = copy.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); track.appendChild(clone);
    }
    animation = track.animate([{transform: 'translateX(0)'}, {transform: `translateX(-${width}px)`}],
      {duration: width / Math.max(1, Number(cfg.tickerSpeed) || 85) * 1000, iterations: Infinity, easing: 'linear'});
  }
  sizeTicker(); addEventListener('resize', sizeTicker);
  let current = null, next = null, index = 0, timer, failures = 0;
  function prepare(i) {
    const item = list[i];
    if (item.type === 'live') {
      const el = document.createElement('div'); el.className = 'media live';
      const entry = {el, i, failed: false};
      entry.ready = (live ? live.render(item.widget, el) : Promise.resolve(false))
        .then(ok => { if (!ok) entry.failed = true; return ok; }, () => { entry.failed = true; return false; });
      screen.appendChild(el); return entry;
    }
    const el = document.createElement(item.type === 'image' ? 'img' : 'video');
    el.className = 'media';
    const entry = {el, i, failed: false};
    el.addEventListener('error', () => {
      entry.failed = true;
      if (entry === current) advance(true);
    });
    if (item.type !== 'image') {
      el.muted = true; el.defaultMuted = true; el.playsInline = true;
      el.preload = 'auto'; el.controls = false;
      el.addEventListener('ended', () => { if (entry === current) advance(false); });
    } else { el.alt = ''; }
    el.src = item.src; screen.appendChild(el); return entry;
  }
  function advance(failed) {
    clearTimeout(timer);
    failures = failed ? failures + 1 : 0;
    if (failures >= list.length) {
      status.textContent = 'Media unavailable — retrying shortly';
      timer = setTimeout(() => { failures = 0; activate(); }, 10000); return;
    }
    activate();
  }
  function activate() {
    clearTimeout(timer);
    const old = current;
    current = next || prepare(index); index = current.i;
    next = null;
    if (old && old !== current) old.el.remove();
    status.textContent = '';
    if (current.failed) { timer = setTimeout(() => advance(true), 0); return; }
    const entry = current;
    if (list[index].type === 'live') {
      // Live slides: wait for data (usually cached); skip silently if it failed.
      entry.ready.then(ok => {
        if (current !== entry) return;
        if (!ok) { advance(true); return; }
        entry.el.classList.add('active');
        timer = setTimeout(() => advance(false), Math.max(1, Number(list[index].duration) || 12) * 1000);
      });
      next = prepare((index + 1) % list.length);
      window.TV_PLAYER_STATE = {index, src: 'live:' + list[index].widget};
      return;
    }
    current.el.classList.add('active');
    if (list[index].type === 'image') {
      timer = setTimeout(() => advance(false), Math.max(1, Number(list[index].duration) || 10) * 1000);
    } else {
      // Decode/play the already-preloaded next video immediately on each transition.
      entry.el.play().catch(() => { if (current === entry) advance(true); });
    }
    next = prepare((index + 1) % list.length);
    window.TV_PLAYER_STATE = {index, src: list[index].src};
  }
  if (list.length) activate(); else status.textContent = 'Add videos or photos to config.js';
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen(); } catch (_) { /* TV may restrict fullscreen. */ }
  }
  document.addEventListener('click', fullscreen);
  document.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'f' && !e.repeat) fullscreen(); });
  const reloadMs = Number(cfg.reloadHours) * 3600000;
  if (reloadMs > 0) setTimeout(() => location.reload(), Math.min(reloadMs, 2147483647));
})();
