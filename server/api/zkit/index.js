const User = require('../../models/User')
const router = require('express').Router()
const adminApi = require('./adminApi')
const uid = require('uid2')
const fs = require('fs')
const path = require('path')
const smartContract = require('../../contract-calls')
const adminCheck = require('./middleware')

/// / UPLOAD CSS FOR LOGIN/REGISTRATION IFRAME
const pathCss = path.join('assets', 'form.css')

adminApi.uploadCustomContent('css/login.css', fs.readFileSync(pathCss))
  .then((res) => console.log(res))
  .catch((err) => console.log(err))

router.post('/init-user-registration', async function (req, res, next) {
  const { username, zkitId } = req.body
  const { getAdmin, createNewUser } = await smartContract

  const existUser = await User.findOne({ username })

  if (existUser) {
    return res.status(400).json({ message: 'User name taken' })
  }

  const userCount = await User.count()
  let userAddress
  const admin = await getAdmin()
  if (userCount === 0) {
    userAddress = admin
  } else {
    if (!zkitId) {
      return res.status(400).end({ message: 'You have to provide your zkitid in request payload' })
    }
    const requestOriginator = await User.findOne({ zkitId })
    if (requestOriginator.address !== admin) {
      return res.status(400).end({ message: 'Only admin have privileges to create user' })
    }
    userAddress = createNewUser().address
  }

  const initInfo = await adminApi.initUserRegistration()

  const user = new User({
    username,
    zkitId: initInfo.UserId,
    registrationData: {
      sessionId: initInfo.RegSessionId,
      sessionVerifier: initInfo.RegSessionVerifier
    },
    state: 0,
    address: userAddress
  })

  user.save()

  res.status(200).json({
    userId: user.zkitId,
    regSessionId: user.registrationData.sessionId
  })
})

router.post('/finish-user-registration', adminCheck, async function (req, res, next) {
  const { userId, validationVerifier } = req.body

  const validationCode = uid(32)
  const user = await User.findOne({ zkitId: userId, state: 0 })

  if (user.state !== 0) throw new Error('UserInWrongState')

  user.registrationData.validationVerifier = validationVerifier
  user.registrationData.validationCode = validationCode
  user.state = 1

  // validate user when register
  const { sessionId, sessionVerifier } = user.registrationData

  try {
    await adminApi.validateUser(user.zkitId, sessionId, sessionVerifier, validationVerifier)
  } catch (e) {
    console.log(e)
  }

  res.json({id: user.id, username: user.username})
})

router.get('/user', async function (req, res, next) {
  const { username, zkitId } = req.query

  const user = typeof username === 'string'
    ? await User.findOne({ username })
    : await User.findOne({ zkitId })

  if (!user) { return res.status(400).json({ message: 'User does not exist' }) }

  res.json(user)
})

module.exports = router
