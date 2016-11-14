setInterval(() => {
  require('./lib/immoscout').run();
  require('./lib/wgGesucht').run();
}, 10 * 60 * 1000);