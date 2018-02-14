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
    res.json(newFile)
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

router.get('/files/:id', async (req, res) => {
  const { id } = req.params
  // check if this is admin
  const files = await File.findById(id)
  res.json(files)
})

router.get('/groups', async (req, res) => {
  const { userId } = req.query
  let find = {}
  if (userId) {
    find['userId'] = userId
  }
  const groups = await Group.find(find)

  res.json(groups)
})

router.get('/users', async (req, res) => {
  const { substr } = req.query
  let find = {}
  if (substr) {
    find = { username: { $regex: req.query.substr, $options: 'i' } }
  }
  const users = await User.find(find)
  res.json(users)
})

router.get('/users/:id', async (req, res) => {
  const { id } = req.params

  const users = await User.findById(id)
  res.json(users)
})

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params

  await User.findByIdAndRemove(id)
  Group.findByIdAndUpdate({ userIds: id }, { $pull: { userIds: id } })
  res.status(200).end()
})

router.delete('/files/:id', async (req, res) => {
  const { id } = req.params

  await File.findByIdAndRemove(id)
  Group.findByIdAndUpdate({ userIds: id }, { $pull: { fileIds: id } })

  res.status(200).json({})
})

router.delete('/groups/:id', async (req, res) => {
  const { id } = req.params

  await Group.findByIdAndRemove(id)
  res.status(200).end()
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
  const file = await File.findOne({ _id: fileId })
  const user = await User.findOne({ _id: userId })

  if (typeof fileId !== 'string' && typeof groupId !== 'string' && !fileId && groupId) {
    res.status(400).end('Invalid fileId or groupId')
  }

  const update = {}
  let resp
  if (fileId && typeof fileId === 'string') {
    if (!file) {
      return res.status(400).end('Invalid fileId')
    }
    update['fileIds'] = fileId
    resp = file
  }
  if (userId && typeof userId === 'string') {
    if (!user) {
      return res.status(400).end('Invalid userId')
    }
    update['userIds'] = userId
    resp = user
  }

  await Group.findByIdAndUpdate(groupId, { $addToSet: update }, { new: true })
  res.json(resp)
})

// // REMOVE GROUP or remove fileId or userId from a group
router.delete('/groups/:groupId', async (req, res) => {
  const { fileId, userId } = req.body
  const { groupId } = req.params
  const file = await File.findOne({ _id: fileId })
  const user = await User.findOne({ _id: userId })

  if (typeof fileId !== 'string' && typeof groupId !== 'string' && !fileId && groupId) {
    res.status(400).end('Invalid fileId or groupId')
  }

  const update = {}
  let resp
  if (fileId && typeof fileId === 'string') {
    if (!file) {
      return res.status(400).end('Invalid fileId')
    }
    update['fileIds'] = fileId
    resp = file
  }
  if (userId && typeof userId === 'string') {
    if (!user) {
      return res.status(400).end('Invalid userId')
    }
    update['userIds'] = userId
    resp = user
  }

  Group.findByIdAndUpdate(groupId, { $pull: update })
  res.json(resp)
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