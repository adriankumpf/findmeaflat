function isOneOf(word, arr = []) {
  const expression = String.raw`\b(${arr.join('|')})\b`
  const blacklist = new RegExp(expression, 'ig')

  return blacklist.test(word)
}

function smallerEquals(int, reference) {
  if (int != undefined) {
    return int <= reference
  }
  else return true
}

function shorten(str, len = 30) {
  if (str && str.length)
    return str.length > len ? str.substring(0, len) + '...' : str
}

function objectToQuerystring(obj) {
  return Object.keys(obj).reduce((str, key, i) => {
    const delimiter = i === 0 ? '?' : '&'
    const k = encodeURIComponent(key)
    const v = encodeURIComponent(obj[key])
    return [str, delimiter, k, '=', v].join('')
  }, '')
}

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

module.exports = { isOneOf, smallerEquals, shorten, objectToQuerystring, random }
