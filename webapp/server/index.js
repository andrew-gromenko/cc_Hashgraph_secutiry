const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Route handlers
const api = require('./api')
const zkit = require('./api/zkit')

var morgan = require('morgan')
require('dotenv').config()

const zkitMiddle = (req, res, next) => {
  req.body.zkitId = req.get('ZkitID-Auth')
  next()
}

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
  console.log('Connected to DB TEST')
})

app.use(express.static('../client/dist'))
app.use(morgan('combined'))
app.use(zkitMiddle)
app.use('/api/zkit', zkit)
app.use('/api', api)

app.listen(port, () => console.log(`listening on port ${port}`))
