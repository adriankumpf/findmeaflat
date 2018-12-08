const FlatFinder = require('lib/flatfinder')
const config = require('conf/config.json')
const utils = require('lib/utils')

function normalize (o) {
  const id = parseInt(o.id.split('_')[1], 10)
  const title = o.title.replace('NEU ', '')
  const address = o.address ? o.address.split(' • ')[1] : ''

  return Object.assign(o, { id, title, address })
}

function applyBlacklist (o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, config.blacklist)
  const descNotBlacklisted = !utils.isOneOf(o.description, config.blacklist)

  return titleNotBlacklisted && descNotBlacklisted
}

const enabled = !!config.providers.immonet

const immonet = {
  name: 'immonet',
  enabled,
  url: !enabled || config.providers.immonet.url,
  crawlContainer: '#result-list-stage .item',
  crawlFields: {
    id: 'div[onclick^=try] a@id | trim',
    price: '#keyfacts-bar div:first-child span | int',
    size: '#keyfacts-bar div:nth-child(2) p:nth-child(2) | trim | int',
    title: 'div[onclick^=try] a@title | removeNewline | trim',
    link: 'div[onclick^=try] a@href',
    address: 'div[onclick^=try]  > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) | removeNewline | trim'
  },
  paginate: '.pagination-wrapper + a@href',
  normalize: normalize,
  filter: applyBlacklist
}

module.exports = new FlatFinder(immonet)
