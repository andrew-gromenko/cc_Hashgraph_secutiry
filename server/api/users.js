const router = require('express').Router()
const uid = require('uid2')
const twoFactor = require('node-2fa')

const Group = require('../models/Group')
const User = require('../models/User')

const adminApi = require('./admin')
const smartContract = require('../utils/contract-calls')
const checkAdmin = require('../utils/adminCheck')

router.get('/get-user-id', async (req, res) => {
  const username = req.query.userName

  if (!username) {
    return res.status(400).json({ message: 'Username not supplied' })
  }

  const user = await User.findOne({ username })
  if (!user) {
    return res.status(400).json({ message: 'No such user' })
  }
  res.json(user.zkitId)
})

router.get('/admin', async (req, res) => {
  const { getAdmin } = await smartContract
  const adminAddress = await getAdmin()
  const { zkitId } = req.query

  if (zkitId) {
    const user = await User.findOne({ zkitId })
    if (!user) {
      return res.status(400).json({ message: 'Invalid request' })
    }
    return res.json(user.address === adminAddress)
  }
  const admin = await User.findOne({ address: adminAddress })
  return res.json({ admin })
})

router.get('/count', async (req, res) => {
  const count = await User.count({})

  res.json({ count })
})

router.get('/', checkAdmin, async (req, res) => {
  const { substr } = req.query
  let find = {}
  if (substr) {
    find = { username: { $regex: req.query.substr, $options: 'i' } }
  }
  const users = await User.find(find)
  res.json(users)
})

router.get('/get-by-zkit', checkAdmin, async (req, res) => {
  const { zkitId } = req.query
  if (!zkitId) {
    return res.status(400).json({ message: 'You should provide zkitId' })
  }
  const user = await User.findOne({ zkitId })
  res.json(user)
})

router.get('/2factor-auth', async (req, res) => {
  const { username } = req.query
  const user = await User.findOne({ username })
  if (!user) {
    return res.status(400).json({ message: 'Invalid request' })
  }
  res.json(user.twoFactorAuth)
})

router.post('/2factor-auth', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'You should be authenticated to access thsi route' })
  }
  await User.findByIdAndUpdate(req.user.id, { twoFactorAuth: !req.user.twoFactorAuth })
  res.json({})
})

router.get('/me', async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  const user = await User.findById(req.user.id)
  res.json(user)
})

router.get('/:id', checkAdmin, async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id)
  res.json(user)
})

router.delete('/:id', checkAdmin, async (req, res) => {
  const { id } = req.params

  await User.findByIdAndRemove(id)
  await Group.find({ userIds: id }).update({ $pull: { userIds: id } })

  res.status(200).json({})
})

router.post('/', checkAdmin, async (req, res) => {
  const { username } = req.body

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ message: 'Invalid username' })
  }

  try {
    const newUser = await User.create({ username })
    res.json(newUser.id)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/init-user-registration', async (req, res) => {
  const { username } = req.body
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
    if (!req.isAuthenticated()) {
      res.status(401).json({ message: 'You have to be authenticated to access this route' })
    }
    if (req.user.address !== admin) {
      return res.status(400).json({ message: 'Only admin have privileges to create user' })
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

  await user.save()

  res.status(200).json({
    userId: user.zkitId,
    regSessionId: user.registrationData.sessionId
  })
})

router.post('/finish-user-registration', async (req, res) => {
  const { userId, validationVerifier } = req.body

  const validationCode = uid(32)
  const user = await User.findOne({ zkitId: userId, state: 0 })

  if (!user) {
    return res.status(400).json({ message: 'Invalid user data' })
  }

  if (user.state !== 0) throw new Error('UserInWrongState')

  const secretData = twoFactor.generateSecret({ name: 'sapientiae.tech', account: user.username })
  user.secret = secretData.secret
  user.qr = secretData.qr

  user.registrationData.validationVerifier = validationVerifier
  user.registrationData.validationCode = validationCode
  user.state = 2

  await user.save()

  const { sessionId, sessionVerifier } = user.registrationData

  try {
    await adminApi.validateUser(user.zkitId, sessionId, sessionVerifier, validationVerifier)
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }
  res.json({id: user.id, username: user.username, qrCode: secretData.qr, user})
})

module.exports = router
