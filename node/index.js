const express = require('express')
const app = express()
const bodyPaser = require('body-parser')

const router = require('./controllers')

/*
 * Load middlewares
 */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/**
 * Routes
 */
app.use('/api', router)

app.listen(3000, () => {
  console.log('listening on port 3000...')
})