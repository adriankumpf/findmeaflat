const config = require('../../conf/config.json');
const FlatFinder = require('../flatfinder');
const utils = require('../utils');
const got = require('got');

function getUrl(flatType) {
  const initialUrl = 'https://www.wg-gesucht.de/wohnungen-in-' +
    config.wggesucht.city + '.' +
    config.wggesucht.cityKey + '.' +
    flatType + '.1.0.html';

  const options = {
    body: {
      "ad_type": 0,
      "autocompinp": config.wggesucht.city,
      "bewohner_geschlecht": 0,
      "changesth": 1,
      "filter": 1,
      "geschlecht": 0,
      "haustier": 0,
      "js_active": 1,
      "max_miete": config.wggesucht.maxRent,
      "mietart": 2,
      "min_groesse": config.wggesucht.minSize,
      "moebliert": 0,
      "rauchen": 0,
      "rubrik": flatType,
      "stadt_key": config.wggesucht.cityKey,
      "tausch": 2,
      "wgsize_max": 0,
      "wgsize_min": 0,
      "zeitraum": 0,
      "zimmer_max": 0,
      "zimmer_min": 0
    },
    headers: {
      'user-agent': config.userAgent
    }
  };

  return got.post(initialUrl, options)
    .then(
      _ => {},
      err => {
        if (err.response.statusCode !== 301) {
          throw Error(err.response.statusMessage);
        }
        return err.response.headers.location;
      }
    );
}

function normalize(o) {
  const id = parseInt(o.id.split('-').pop());

  const details = o.details.split(' Verfügbar: ab ');
  const address = details[0].split(' in ')[1];

  const sizePrice = o.sizePrice.split(' - ');
  const size = sizePrice[0];
  const price = sizePrice[1];

  return Object.assign(o, { id, size, price, address });
}

function applyFilter(o) {
  const wishDistrict = utils.isBlacklisted(o.address, config.wantedDistricts);
  const notBlacklisted = !utils.isBlacklisted(o.title, config.blacklist);

  return wishDistrict && notBlacklisted;
}

const createFinder = (name, flatType) => {
  const source = {
    name: name,
    url: getUrl(flatType),
    crawlContainer: '#main_column .panel.panel-default:not(.panel-hidden)',
    crawlFields: {
      id: '@id',
      sizePrice: '.detail-size-price-wrapper .detailansicht | removeNewline | trim',
      title: '.headline.printonly .detailansicht | removeNewline | trim',
      link: '.headline.printonly .detailansicht@href',
      details: '.row p | removeNewline | trim',
    },
    process: normalize,
    filter: applyFilter,
  };

  return new FlatFinder(source);
};

const studioFinder = createFinder('wgGesucht.studioFlat', 1);
const normalFinder = createFinder('wgGesucht.normalFlat', 2);

module.exports = {
  run: () => {
    Promise.all([
      studioFinder.run(),
      normalFinder.run(),
    ])
  }
}
