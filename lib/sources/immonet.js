const FlatFinder = require('lib/flatfinder')
const config = require('conf/config.json')
const utils = require('lib/utils')

function normalize(o) {
  const id = parseInt(o.id.split('_')[1], 10)
  const title = o.title.replace('NEU ', '')
  const size = o.size + ' m²'
  const rooms = o.rooms + ' Zimmer'
  const property_size = o.property_size ? 'Grundstück: ' + o.property_size + ' m²' : o.property_size

  // Immonet shows different parameters when searching via radius vs. without radius
  const address_split = o.address.split(' • ')
  let radius_distance = undefined
  let address = undefined
  let floor_type = undefined
  if (address_split.length == 3) {
    radius_distance = parseInt(o.address ? address_split[0].split(' km')[0] : 0, 10)
    address = o.address ? address_split[2] : ''
    floor_type = o.address ? address_split[1] : ''
  }
  else {
    address = o.address ? address_split[1] : ''
    floor_type = o.address ? address_split[0] : ''
  }

  return Object.assign(o, { id, title, floor_type, address, size, property_size, rooms, radius_distance })
}

function applyBlacklist(o) {
  const titleNotBlacklisted = !utils.isOneOf(o.title, config.blacklist)
  const descNotBlacklisted = !utils.isOneOf(o.description, config.blacklist)
  const floorTypeNotBlacklisted = !utils.isOneOf(o.floor_type, config.blacklist)
  // Prevent showing an object that is outside of an already set radius via search
  const maxRadiusDistance = utils.smallerEquals(o.radius_distance, config.maxDistanceInKilometres)
  return titleNotBlacklisted && descNotBlacklisted && floorTypeNotBlacklisted && maxRadiusDistance
}

const enabled = !!config.providers.immonet

const immonet = {
  name: 'immonet',
  enabled,
  url: !enabled || config.providers.immonet.url,
  crawlContainer: '#result-list-stage .item',
  crawlFields: {
    id: 'div[onclick^=try] a@id | trim',
    price: '#keyfacts-bar div[id*="selPrice"] span',
    size: '#keyfacts-bar div[id*="selArea"] p:nth-child(2) | trim | int',
    property_size: '#keyfacts-bar div[id*="plotArea"] p:nth-child(2) | trim | int',
    title: 'div[onclick^=try] a@title | removeNewline | trim',
    link: 'div[onclick^=try] a@href',
    address: '.box-25.ellipsis span.text-100 | removeNewline | trim',
    rooms: '#keyfacts-bar div[id*="selRooms"] p:nth-child(2) | trim',
    floor_type: '.box-25.ellipsis span.text-100 | removeNewline | trim',
    radius_distance: '.box-25.ellipsis span.text-100 | removeNewline | trim',
  },
  paginate: '.pagination-wrapper + a@href',
  normalize: normalize,
  filter: applyBlacklist,
}

module.exports = new FlatFinder(immonet)
