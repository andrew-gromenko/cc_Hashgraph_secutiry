const passport = require('passport')
const openIDConnect = require('passport-openidconnect')
const OAuth2 = require('oauth').OAuth2

const config = require('../app.config.js')
const User = require('../models/User')

var twoFactor = require('node-2fa')

const client = config.zeroKit.idp[0]

passport.serializeUser((user, done) => { console.log('USER: ', user); done(null, user); })
passport.deserializeUser((obj, done) => { console.log('USER: ', obj); done(null, obj); })

const openidVerifyCallback = (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, verifiedCb) => {
  console.log('PROFILE: ', profile.id)
 return User.findOne({ zkitId: profile.id })
    .then(user => { console.log(user); return user; })
    .then(user => ({ error: null, user }))
    .then(({ error, user }) => verifiedCb(error, user))
}

passport.use(`openid`, new openIDConnect.Strategy(client, openidVerifyCallback))

const currClient = new OAuth2(client.clientID, client.clientSecret, '', client.authorizationURL, client.tokenURL)
currClient.callbackURL = client.callbackURL
currClient.issuer = client.issuer

const authApi = require('express').Router()

authApi.get('/login', async (req, res, next) => {
  const { token, username } = req.query
  const user = await User.findOne({ username })
  if (!token) {
    return res.status(400).json({ message: 'You should provide a token' })
  }
  
  const verify = twoFactor.verifyToken(user.secret, token)
  console.log(user, user.secret, verify, token)
  if (!verify || verify.delta !== 0) {
    return res.status(401).json({ message: 'The token you entered is incorect' })
  }

  req.session.returnTo = req.query.reto

  return passport.authenticate('openid')(req, res, next)
})

authApi.get('/callback', (req, res, next) => passport.authenticate('openid', {
  successRedirect: req.session.returnTo,
  failureRedirect: req.session.returnTo + '#error'
})(req, res, next)
)

authApi.get('/logout', (req, res) => {
  req.logout()
  res.json({})
})

module.exports = authApi
