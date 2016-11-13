const storage = require('lowdb/lib/file-async');
const low = require('lowdb');
const path = require('path');

const DB_PATH = path.dirname(require.main.filename) + '/conf/ts.json';

const formData = require('../conf/formData.json');
const config = require('../conf/config.json');

class Store {

  constructor() {
      this._db = low(DB_PATH, { storage });
  };

  url(flatType = 1) {
    return `https://www.wg-gesucht.de/wohnungen-in-${config.city}.${config.cityKey}.${flatType}.1.0.html`;
  }

  searchCriteria(flatType = 1) {
    const criteria = JSON.parse(JSON.stringify(formData));

    criteria.min_groesse = config.minSize;
    criteria.max_miete = config.maxRent;
    criteria.stadt_key = config.cityKey;
    criteria.rubrik = flatType;
    criteria.autocompinp = config.city;

    return criteria;
  }

  get header() {
    return 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
  }

  get wantedDistricts() {
    return config.wantedDistricts;
  }

  get blacklist() {
    return config.blacklist;
  }

  set timestamp1(value) {
    this._db
        .set('timestamp1', parseInt(value,10))
        .value();
  }

  get timestamp1() {
    return this._db
        .get('timestamp1')
        .value();
  }

  set timestamp2(value) {
    this._db
        .set('timestamp2', parseInt(value,10))
        .value();
  }

  get timestamp2() {
    return this._db
        .get('timestamp2')
        .value();
  }

}

module.exports = new Store();
