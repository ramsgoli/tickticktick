require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const router = require('./routers')

/*
 * Load middlewares
 */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/**
 * Routes
 */
app.use('/api', router)

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}...`)
})