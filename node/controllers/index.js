const util = require('../util')

function postHandler(req, res) {
  const sanitized = util.sanitize(req.body.text)
  res.send(sanitized)
}

module.exports = {
  postHandler
}