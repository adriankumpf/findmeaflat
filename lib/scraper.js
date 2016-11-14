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

    const xray = Xray({ filters });
    xray.driver(driver);

    this.xray = xray;
  }

  get x() {
    return this.xray;
  }

  _removeNewline(value) {
    return typeof value === 'string' ? value.replace(/\\n/g, '') : value;
  }

  _trim(value) {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value;
  }

}

module.exports = new Scraper().x;
