require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const { WebClient } = require('@slack/client');
const web = new WebClient(process.env.SLACK_AUTH_TOKEN);

const router = require('./routers')

/*
 * Load middlewares
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use((req, res, next) => {
  req.web = web
  next()
})

/**
 * Routes
 */
app.use('/api', router)

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}...`)
})