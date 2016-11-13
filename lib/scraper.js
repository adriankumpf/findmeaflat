const makeDriver = require('request-x-ray')
const Xray = require('x-ray');

const store = require('./store');

class Scraper {

  constructor() {
    const filters = {
      removeNewline: this._removeNewline,
      trim: this._trim,
    };

    const driver = makeDriver({
      headers: {
        "User-Agent": store.header
      }
    });

    const x = Xray({ filters });
    x.driver(driver);
    x.delay(500, 2200);

    this.x = x;
  }

  run() {
    return this.x;
  }

  _removeNewline(value) {
    return typeof value === 'string' ? value.replace(/\\n/g, '') : value;
  }

  _trim(value) {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value;
  }

}

module.exports = new Scraper().run();
