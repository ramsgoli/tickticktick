const express = require('express')
const router = express.Router()

const util = require('../util')

router.post('/', (req, res) => {
  const sanitized = util.sanitize(req.body.text)
  console.log('sanitized: ', sanitized)
  res.send(sanitized)
})

module.exports = router