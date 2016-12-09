function isBlacklisted(word, arr) {
  const expression = String.raw `\b(${arr.join("|")})\b`;
  const blacklist = new RegExp(expression, 'ig');

  return blacklist.test(word);
}

function shorten(str, len = 40) {
  return str.length > len ? str.substring(0, len) + "..." : str;
}

module.exports = { isBlacklisted, shorten }