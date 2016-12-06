const sources = './lib/sources';

setInterval(function exec() {
  require('fs')
    .readdirSync(sources)
    .map(file => require(`${sources}/${file}`).run());
  return exec;
}(), 10 * 60 * 1000);
