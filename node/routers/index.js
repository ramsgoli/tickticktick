const express = require('express')
const router = express.Router()
const postController = require('../controllers')

router.post('/', (req, res) => {
  return postController.postHandler(req, res)
})

router.post('/dialog', (req, res) => {
  return postController.dialogHandler(req, res)
})

module.exports = router