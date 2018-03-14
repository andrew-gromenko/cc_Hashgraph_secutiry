const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const crypto = require('crypto')

const passport = require('passport')
const mongoose = require('mongoose')

// Route handlers
const api = require('./api')
const config = require('./app.config')
const adminApi = require('./api/admin')

var morgan = require('morgan')

const fs = require('fs')
const path = require('path')

const port = process.env.SERVER_PORT

const helmet = require('helmet')

app.use(cors({ origin: config.appOrigins, credentials: true }))
app.use(helmet())
app.use(helmet.noCache())
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
const sessionOptions = {
  name: 'sessionId',
  genid: () => 't-' + crypto.randomBytes(32).toString('hex'),
  secret: 'dummy',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}
app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())
mongoose.connect(process.env.MONGO_URI, {
  auth: {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS
  }
})
mongoose.connection.once('open', () => {
  console.log('Connected to DB')
})
app.use(express.static('public'))
app.use(morgan('combined'))
app.use('/api', api)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  err.code = 'NotFound'
  next(err)
})

app.use((err, req, res, next) => {
  console.error(err)
  err = err && err.code ? err : ({ code: 400, message: 'Unexpected' })

  console.log('Error: \n%O', err)
  res.status(err.status || 500)

  res.json({
    code: err.code,
    message: err.message,
    exception: process.env.DEBUG ? err : undefined
  })
})

/// / UPLOAD CSS FOR LOGIN/REGISTRATION IFRAME
const pathCss = path.join('assets', 'form.css')

adminApi.uploadCustomContent('css/login.css', fs.readFileSync(pathCss))
  .then((res) => console.log(res))
  .catch((err) => console.log(err))

app.listen(port, () => console.log(`listening on port ${port}`))
