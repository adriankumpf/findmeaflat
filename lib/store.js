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

  urlWgGesucht(flatType = 1) {
    return `https://www.wg-gesucht.de/wohnungen-in-${config.wggesucht.city}.${config.wggesucht.cityKey}.${flatType}.1.0.html`;
  }

  urlImmoscout() {
    return config.immoscout.url;
  }

  searchCriteria(flatType = 1) {
    const criteria = JSON.parse(JSON.stringify(formData));

    criteria.min_groesse = config.wggesucht.minSize;
    criteria.max_miete = config.wggesucht.maxRent;
    criteria.stadt_key = config.wggesucht.cityKey;
    criteria.rubrik = flatType;
    criteria.autocompinp = config.wggesucht.city;

    return criteria;
  }

  get header() {
    return 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36';
  }

  get wantedDistricts() {
    return config.wggesucht.wantedDistricts;
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
        .value() || 0;
  }

  set timestamp2(value) {
    this._db
        .set('timestamp2', parseInt(value,10))
        .value();
  }

  get timestamp2() {
    return this._db
        .get('timestamp2')
        .value() || 0;
  }

  set knownListings(value) {
    if (!Array.isArray(value)) throw Error('Not a valid array');

    this._db
        .set('knownListings', value)
        .value();
  }

  get knownListings() {
    return this._db
        .get('knownListings')
        .value() || [];
  }

}

module.exports = new Store();
