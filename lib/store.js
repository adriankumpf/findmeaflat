const fs = require('fs');
const path = require('path');

const formData = require('../conf/formData.json');
const config = require('../conf/config.json');
const ts = path.join(__dirname, '../conf/ts.json');

class Store {

  get url() {
    return `https://www.wg-gesucht.de/1-zimmer-wohnungen-in-${config.city}.${config.cityKey}.1.1.0.html`;
  }

  get header() {
    return 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
  }

  get searchCriteria() {
    const criteria = JSON.parse(JSON.stringify(formData));

    criteria.min_groesse = config.minSize;
    criteria.max_miete = config.maxRent;
    criteria.stadt_key = config.cityKey;
    criteria.autocompinp = config.city;

    return criteria;
  }

  get wantedDistricts() {
    return config.wantedDistricts;
  }

  get blacklist() {
    return config.blacklist;
  }

  set timestamp(value) {
    fs.writeFile(ts, JSON.stringify({timestamp: value}, null, 2), err => {
      if (err) throw err;
    });
  }

  get timestamp() {
    return JSON.parse(fs.readFileSync(ts).toString()).timestamp;
  }
}

module.exports = new Store();
