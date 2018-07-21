const express = require('express')
const router = express.Router()
const postController = require('../controllers')

router.post('/', (req, res) => {
  return postController.postHandler(req, res)
})

module.exports = router