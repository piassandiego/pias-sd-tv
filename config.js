// STORE SETTINGS — edit this file with GitHub's pencil icon, then Commit changes.
// Keep quotes, commas and brackets intact. File names are case-sensitive.
window.TV_CONFIG = {
  // Move entire lines to reorder; remove a line to remove an item.
  // Upload videos to videos/ or photos to images/, then add a line here.
  // Video example: { type: 'video', src: 'videos/22-new-video.mp4' },
  // Photo example: { type: 'image', src: 'images/team.jpg', duration: 10 },
  // Live example:  { type: 'live', widget: 'weather', duration: 12 },
  //   Data widgets: 'weather', 'snow-socal', 'snow-west', 'surf' (refreshed every 30 min
  //   by .github/workflows/update-data.yml) and 'item' (data/item-of-day.json, built by
  //   scripts/make_item_of_day.py). Promo widgets (text is set further down in this file):
  //   'blackfriday', 'buying', 'textjoin', 'reviews'. A live slide with no data is skipped.
  // Layout: every video is followed by one '// info' slide. Odd videos get a
  // '// info (featured)' slide alternating Black Friday and Item of the day; even videos
  // rotate policy, weather, buying, snow services, SoCal snow, reviews, bike services,
  // western snow, text-to-join and surf. Every second video also gets a '// social'
  // slide (follow-us or a post). To remove an info or
  // social slide, delete its line; to reorder, move whole lines. Avoid putting the
  // same slide on two lines in a row. Durations are seconds (images 8, live 12).
  // Use lowercase file names with hyphens, no spaces.
  playlist: [
    { type: 'video', src: 'videos/01-baseball-softball-01.mp4' },
    { type: 'live', widget: 'blackfriday', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/02-baseball-softball-02.mp4' },
    { type: 'image', src: 'images/return-credit-policy.jpg', duration: 8 },   // info
    { type: 'image', src: 'images/follow-us.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/03-disc-golf-01.mp4' },
    { type: 'live', widget: 'item', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/04-disc-golf-02.mp4' },
    { type: 'live', widget: 'weather', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-06-golf.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/05-fitness-01.mp4' },
    { type: 'live', widget: 'blackfriday', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/06-football-01.mp4' },
    { type: 'live', widget: 'buying', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-06-ice-hockey.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/07-general-01.mp4' },
    { type: 'live', widget: 'item', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/08-general-02.mp4' },
    { type: 'image', src: 'images/services-snow.jpg', duration: 8 },   // info
    { type: 'image', src: 'images/feed-2026-11-05-disc-golf.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/09-general-03.mp4' },
    { type: 'live', widget: 'blackfriday', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/10-golf-01.mp4' },
    { type: 'live', widget: 'snow-socal', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-05-roller-hockey.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/11-golf-02.mp4' },
    { type: 'live', widget: 'item', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/12-hockey-02.mp4' },
    { type: 'live', widget: 'reviews', duration: 12 },   // info
    { type: 'image', src: 'images/follow-us.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/13-hockey-ccm-01.mp4' },
    { type: 'live', widget: 'blackfriday', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/14-holidays.mp4' },
    { type: 'image', src: 'images/services-bicycle.jpg', duration: 8 },   // info
    { type: 'image', src: 'images/feed-2026-11-04-fitness.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/15-lacrosse-01.mp4' },
    { type: 'live', widget: 'item', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/16-shop-online-01.mp4' },
    { type: 'live', widget: 'snow-west', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-03-skiing.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/17-snow-sports-01.mp4' },
    { type: 'live', widget: 'blackfriday', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/18-snow-sports-02.mp4' },
    { type: 'live', widget: 'textjoin', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-02-tennis-hours.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/19-soccer-01.mp4' },
    { type: 'live', widget: 'item', duration: 12 },   // info (featured)
    { type: 'video', src: 'videos/20-pias-brand-commercial.mp4' },
    { type: 'live', widget: 'surf', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-01-baseball-trade-in.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/21-pias-sustainability-commercial.mp4' },
    { type: 'live', widget: 'blackfriday', duration: 12 },   // info (featured)
  ],
  // ---- Black Friday countdown slide (widget 'blackfriday') ----
  // Counts down using Pacific time. Hides itself automatically after hideAfter.
  blackFriday: {
    label: 'Black Friday · Fri Nov 27',
    date: '2026-11-27',                       // sale day, YYYY-MM-DD
    hideAfter: '2026-11-27T19:00:00-08:00',   // stop showing after 7pm PT that day
    image: 'images/black-friday-art.jpg',
    saveTheDate: 'Save the date',             // shown every day BEFORE the sale (no discounts)
    showOffersOnSaleDay: true,                // true = on Fri 11/27 (PT) show the offers below; false = keep "Save the date"
    offers: [                                 // ONLY shown on the sale day; first line shows biggest
      { deal: '50% off one item', when: '10am–1pm' },
      { deal: '30% off one item', when: 'the rest of the day' },
    ],
    hours: 'Open 10am–7pm',
    note: 'Closed Thanksgiving, Thu 11/26',  // shown before the sale day
    finePrint: 'Restrictions apply. See store for details.',  // sale day only
  },
  // ---- "We're buying right now" slide (widget 'buying') ----
  // Edit the wants list each season: one quoted item per line.
  buying: {
    kicker: "We're buying right now",
    title: 'We pay cash or trade for your gear',
    wants: [
      'Skis, snowboards, boots & bindings',
      'Ice & roller hockey skates',
      'Hockey sticks & goalie gear',
      'Youth cleats',
      'Golf clubs',
      'Fitness equipment',
    ],
    cta: 'Bring it in today',
    hours: 'Mon–Fri 10–7 · Sat 10–6 · Sun 11–5',
  },
  // ---- Text-to-join slide (widget 'textjoin') ----
  textJoin: {
    lead: 'Get deals & trade-in offers by text',
    keyword: 'TRADEIN',
    number: '578-277',
    finePrint: 'Msg & data rates may apply. Reply STOP to opt out.',
  },
  // ---- Google reviews slide (widget 'reviews') ----
  // Quotes rotate each time the slide plays. Use exact review text, first name + last initial.
  reviews: {
    kicker: 'Google reviews',
    title: '4.3 ★ on Google · 220+ reviews',
    quotes: [
      { text: 'Stellar service with tons and tons of goodies!', name: 'Tim R.' },
      { text: 'Always super helpful and informative', name: 'Ken W.' },
    ],
    qr: 'images/qr-google-review.png',        // opens Google "write a review" for our store
    qrLabel: 'Scan to leave us a review',
  },
  // Change the words inside quotes; add/remove whole lines for messages.
  tickerMessages: [
    'New items may be returned within 14 days with receipt',
    'All sales of used equipment are final',
    'We buy used sports gear every day: bring it in for cash or trade',
    'Open Mon–Fri 10am–7pm, Sat 10am–6pm, Sun 11am–5pm',
    '9925 Carmel Mountain Rd · (858) 695-3030 · @PIASSanDiego',
  ],
  tickerSpeed: 85, // Pixels per second; increase to scroll faster.
  tickerPosition: 'bottom', // 'bottom' or 'top'; always OUTSIDE the video.
  reloadHours: 4, // Automatic refresh for updates; 0 disables it.
};
