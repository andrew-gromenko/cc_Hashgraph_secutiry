const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const api = require('./api')
var morgan = require('morgan')
require('dotenv').config()

const port = require('../config.json').dev.api.port

// PREREQUISITES
app.use(bodyParser.json())
mongoose.connect(process.env.MONGO_URI, {
  auth: {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS
  }
})
mongoose.connection.once('open', () => {
  console.log('Connected to DB')
})

app.use(morgan('combined'))
app.use('/api', api)

app.listen(port, () => console.log(`listening on port ${port}`))
