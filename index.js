const sources = './lib/sources';

setInterval(() => {
  require('fs')
    .readdirSync(sources)
    .map(file => require(`${sources}/${file}`).run());
}, 10 * 60 * 1000);