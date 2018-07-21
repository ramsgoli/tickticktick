function sanitize(str) {
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
}

module.exports = {
  sanitize: sanitize
}