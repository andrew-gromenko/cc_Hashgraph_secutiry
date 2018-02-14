const Group = require('../models/Group')
const File = require('../models/File')
const User = require('../models/User')
const router = require('express').Router()

// CREATE
router.post('/groups', async (req, res) => {
  const { name, tresorId } = req.body

  if (!name || typeof name !== 'string') {
    return res.status(400).end('Invalid groupname')
  }
  if (!tresorId || typeof tresorId !== 'string') {
    return res.status(400).end('Invalid tresorId')
  }

  try {
    const newGroup = await Group.create({ name, tresorId })
    res.json(newGroup.id)
  } catch (err) {
    res.status(400).end(err.message)
  }
})

router.post('/files', async (req, res) => {
  const { name, encryptedString } = req.body

  if (!name || typeof name !== 'string') {
    return res.status(400).end('Invalid filename')
  }
  if (!encryptedString || typeof encryptedString !== 'string') {
    return res.status(400).end('Invalid encryptedString')
  }

  try {
    const newFile = await File.create({ name, encryptedString })
    res.json(newFile.id)
  } catch (err) {
    res.status(400).end(err.message)
  }
})

router.post('/users', async (req, res) => {
  const { username } = req.body

  if (!username || typeof username !== 'string') {
    return res.status(400).end('Invalid username')
  }

  try {
    const newUser = await User.create({ username })
    res.json(newUser.id)
  } catch (err) {
    res.status(400).end(err.message)
  }
})
// CREATE

// GET
router.get('/files', async (req, res) => {
  const { substr } = req.query
  let find = {}
  if (substr) {
    find = { name: { $regex: req.query.substr, $options: 'i' } }
  }
  // check if this is admin
  const files = await File.find(find)
  res.json(files)
})
router.get('/groups', async (req, res) => {
  const { userId } = req.query
  let find = {}
  if (userId) {
    find['userId'] = userId
  }
  const groups = await Group.find(find).populate('fileIds')

  res.json(groups)
})
router.get('/users', async (req, res) => {
  const { substr } = req.query
  let find = {}
  if (substr) {
    find = { name: { $regex: req.query.substr, $options: 'i' } }
  }
  const users = await User.find(find)
  res.json(users)
})
// GET

// fuzzy search
router.get('/files', async (req, res) => {
  try {
    const files = await File.find()
    res.json(files)
  } catch (err) {
    res.status(400).end(err.message)
  }
})

// // UPDATE GROUP - add fileId or userId to a group
router.patch('/groups/:groupId', async (req, res) => {
  const { fileId, userId } = req.body
  const { groupId } = req.params
  const fileC = await File.count({ _id: fileId })
  const userC = await File.count({ _id: userId })

  if (typeof fileId !== 'string' && typeof groupId !== 'string' && !fileId && groupId) {
    res.status(400).end('Invalid fileId or groupId')
  }

  if (fileC === 0 || userC === 0) {
    res.status(400).end('Invalid fileId or groupId')
  }

  const update = {}
  if (fileId && typeof fileId === 'string') {
    update['fileId'] = fileId
  }
  if (userId && typeof userId === 'string') {
    update['userId'] = userId
  }

  Group.findByIdAndUpdate(groupId, { $addToSet: update })
})

// // REMOVE GROUP or remove fileId or userId from a group
router.delete('/groups/:groupId', async (req, res) => {
  const { fileId, userId } = req.body
  const fileC = await File.count({ _id: fileId })
  const userC = await File.count({ _id: userId })
  if (fileC === 0 || userC === 0) {
    res.status(400).end('fileId or userId is invalid')
  }

  const { groupId } = req.body
  const update = {}
  if (fileId && typeof fileId === 'string') {
    update['fileId'] = [fileId]
  }
  if (userId && typeof userId === 'string') {
    update['userId'] = [userId]
  }

  if (typeof fileId !== 'string' && typeof groupId !== 'string' && !fileId && groupId) {
    res.status(400).end('Invalid fileId or groupId')
  }

  Group.findByIdAndUpdate(groupId, { $pull: update })
})

// router.get('/file/:userId', async (req, res) => {
//   const { userId } = req.params

//   if (!userId && typeof userId !== 'string') {
//     res.status('400').end('Invalid userId')
//   }

//   // Groups which contains user with that Id
//   if (userId) {
//     // replace file ids to files object with ids and names but without encrypted string
//     const groups = await Group.find({ userIds: userId })
//     res.json(groups)
//   }
//   // All groups
//   const groups = await Group.find()
//   res.json(groups)
// })

module.exports = router

// app.get('/files/:id', async (req, res) => {
//   const { id } = req.params

//   const file = await File.findById(id)
//   res.json(file)
// })

// app.remove('/group/:id', async (req, res) => {
//   const { id } = req.params

//   const deletionResult = await Group.findByIdAndRemove(id)

//   req.json(deletionResult)
// })

// app.remove('/file/:id', async (req, res) => {
//   const { id } = req.params

//   const deletionResult = await File.findByIdAndRemove(id)

//   File.find

//   req.json(deletionResult)
// })

// // route for removal of files and group
// // route to get files by id
// // get encrypted string by fileId
// // creation of user, files, groups
// // get all files that contain queried substring