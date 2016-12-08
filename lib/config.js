const querystring = require('querystring');
const formData = require('../conf/formData.json');
const config = require('../conf/config.json');

class Config {

  get urlWgGesucht() {
    return flatType => {
      return `https://www.wg-gesucht.de/wohnungen-in-${config.wggesucht.city}.${config.wggesucht.cityKey}.${flatType}.1.0.html`;
    }
  }

  get urlImmoscout() {
    return config.immoscout.url;
  }

  get urlImmowelt() {
    return config.immowelt.url;
  }

  get urlImmonet() {
    return config.immonet.url;
  }

  get urlKleinanzeigen() {
    return config.kleinanzeigen.url;
  }

  get formWgGesucht() {
    return flatType => {
      const criteria = JSON.parse(JSON.stringify(formData));
      criteria.min_groesse = config.wggesucht.minSize;
      criteria.max_miete = config.wggesucht.maxRent;
      criteria.stadt_key = config.wggesucht.cityKey;
      criteria.autocompinp = config.wggesucht.city;
      criteria.rubrik = flatType;
      return criteria;
    }
  }

  get userAgent() {
    return 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36';
  }

  get wantedDistricts() {
    return config.wantedDistricts;
  }

  get blacklist() {
    return config.blacklist;
  }

}

module.exports = new Config();
