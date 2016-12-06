const formData = require('../conf/formData.json');
const config = require('../conf/config.json');

class Config {

  urlWgGesucht(flatType = 1) {
    return `https://www.wg-gesucht.de/wohnungen-in-${config.wggesucht.city}.${config.wggesucht.cityKey}.${flatType}.1.0.html`;
  }

  urlImmoscout() {
    return config.immoscout.url;
  }

  urlKleinanzeigen() {
    return config.kleinanzeigen.url;
  }

  formWgGesucht(flatType = 1) {
    const criteria = JSON.parse(JSON.stringify(formData));
    criteria.min_groesse = config.wggesucht.minSize;
    criteria.max_miete = config.wggesucht.maxRent;
    criteria.stadt_key = config.wggesucht.cityKey;
    criteria.autocompinp = config.wggesucht.city;
    criteria.rubrik = flatType;

    return criteria;
  }

  get header() {
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
