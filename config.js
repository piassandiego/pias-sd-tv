// STORE SETTINGS — edit this file with GitHub's pencil icon, then Commit changes.
// Keep quotes, commas and brackets intact. File names are case-sensitive.
window.TV_CONFIG = {
  // Move entire lines to reorder; remove a line to remove an item.
  // Upload videos to videos/ or photos to images/, then add a line here.
  // Video example: { type: 'video', src: 'videos/22-new-video.mp4' },
  // Photo example: { type: 'image', src: 'images/team.jpg', duration: 10 },
  // Live example:  { type: 'live', widget: 'weather', duration: 12 },
  //   widgets: 'weather', 'snow-socal', 'snow-west', 'surf' (data refreshes every 30 min
  //   via .github/workflows/update-data.yml; a live slide with no data is skipped).
  // Layout: every video is followed by one '// info' slide, rotating policy, snow
  // services, bike services, weather, SoCal snow, western snow and surf. Every second
  // video also gets a '// social' slide (follow-us or a post). To remove an info or
  // social slide, delete its line; to reorder, move whole lines. Avoid putting the
  // same slide on two lines in a row. Durations are seconds (images 8, live 12).
  // Use lowercase file names with hyphens, no spaces.
  playlist: [
    { type: 'video', src: 'videos/22-new-video.mp4' },
    { type: 'image', src: 'images/return-credit-policy.jpg', duration: 8 },   // info
    { type: 'video', src: 'videos/01-baseball-softball-01.mp4' },
    { type: 'image', src: 'images/services-snow.jpg', duration: 8 },   // info
    { type: 'image', src: 'images/follow-us.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/02-baseball-softball-02.mp4' },
    { type: 'image', src: 'images/services-bicycle.jpg', duration: 8 },   // info
    { type: 'video', src: 'videos/03-disc-golf-01.mp4' },
    { type: 'live', widget: 'weather', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-06-golf.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/04-disc-golf-02.mp4' },
    { type: 'live', widget: 'snow-socal', duration: 12 },   // info
    { type: 'video', src: 'videos/05-fitness-01.mp4' },
    { type: 'live', widget: 'snow-west', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-06-ice-hockey.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/06-football-01.mp4' },
    { type: 'live', widget: 'surf', duration: 12 },   // info
    { type: 'video', src: 'videos/07-general-01.mp4' },
    { type: 'image', src: 'images/return-credit-policy.jpg', duration: 8 },   // info
    { type: 'image', src: 'images/feed-2026-11-05-disc-golf.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/08-general-02.mp4' },
    { type: 'image', src: 'images/services-snow.jpg', duration: 8 },   // info
    { type: 'video', src: 'videos/09-general-03.mp4' },
    { type: 'image', src: 'images/services-bicycle.jpg', duration: 8 },   // info
    { type: 'image', src: 'images/feed-2026-11-05-roller-hockey.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/10-golf-01.mp4' },
    { type: 'live', widget: 'weather', duration: 12 },   // info
    { type: 'video', src: 'videos/11-golf-02.mp4' },
    { type: 'live', widget: 'snow-socal', duration: 12 },   // info
    { type: 'image', src: 'images/follow-us.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/12-hockey-02.mp4' },
    { type: 'live', widget: 'snow-west', duration: 12 },   // info
    { type: 'video', src: 'videos/13-hockey-ccm-01.mp4' },
    { type: 'live', widget: 'surf', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-04-fitness.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/14-holidays.mp4' },
    { type: 'image', src: 'images/return-credit-policy.jpg', duration: 8 },   // info
    { type: 'video', src: 'videos/15-lacrosse-01.mp4' },
    { type: 'image', src: 'images/services-snow.jpg', duration: 8 },   // info
    { type: 'image', src: 'images/feed-2026-11-03-skiing.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/16-shop-online-01.mp4' },
    { type: 'image', src: 'images/services-bicycle.jpg', duration: 8 },   // info
    { type: 'video', src: 'videos/17-snow-sports-01.mp4' },
    { type: 'live', widget: 'weather', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-02-tennis-hours.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/18-snow-sports-02.mp4' },
    { type: 'live', widget: 'snow-socal', duration: 12 },   // info
    { type: 'video', src: 'videos/19-soccer-01.mp4' },
    { type: 'live', widget: 'snow-west', duration: 12 },   // info
    { type: 'image', src: 'images/feed-2026-11-01-baseball-trade-in.jpg', duration: 8 },   // social
    { type: 'video', src: 'videos/20-pias-brand-commercial.mp4' },
    { type: 'live', widget: 'surf', duration: 12 },   // info
    { type: 'video', src: 'videos/21-pias-sustainability-commercial.mp4' },
    { type: 'image', src: 'images/return-credit-policy.jpg', duration: 8 },   // info
  ],
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
