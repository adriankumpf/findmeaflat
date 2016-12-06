setInterval(() => {
  require('./lib/immoscout').run();
  require('./lib/wgGesucht').run();
  require('./lib/kleinanzeigen').run();
}, 10 * 60 * 1000);
