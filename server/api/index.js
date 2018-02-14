const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Group = require('../models/Group')
const File = require('../models/File')
const User = require('../models/User')
const mongoose = require('mongoose')
require('dotenv').config()

const port = require('../../config.json').dev.api.port;


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

app.get('/files')

// CREATE
app.post('/group', async (req, res) => {
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

app.post('/file', async (req, res) => {
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

app.post('/user', async (req, res) => {
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

app.get('/file', async (req, res) => {
  try {
    const files = await Group.find({ name: { $regex: req.query.substr, $options: 'i' } })
    res.json(files)
  } catch (err) {
    res.status(400).end(err.message)
  }
})

app.listen(port, () => console.log('listening on port 3000'))

module.exports = app
// CREATE

app.get('/group/:userId', async (req, res) => {
  const { userId } = req.params

  if (!userId && typeof userId !== 'string') {
    res.status('400').end('Invalid userId')
  }

  // Groups which contains user with that Id
  if (userId) {
    // replace file ids to files object with ids and names but without encrypted string
    const groups = await Group.find({ userIds: userId })
    res.json(groups)
  }
  // All groups
  const groups = await Group.find()
  res.json(groups)
})

// // UPDATE GROUP - add fileId or userId to a group
// app.patch('/group/:groupId', (req, res) => {
//   const { fileId, userId } = req.body
//   const { groupId } = req.body
//   const update = {}
//   if (fileId && typeof fileId === 'string') {
//     update['fileId'] = fileId
//   }
//   if (userId && typeof userId === 'string') {
//     update['userId'] = userId
//   }

//   if (typeof fileId !== 'string' && typeof groupId !== 'string' && !fileId && groupId) {
//     res.status(400).end('Invalid fileId or groupId')
//   }

//   Group.findByIdAndUpdate(groupId, { $addToSet: update })
// })

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
// // route for addition [files, users] - PATCH
// // route to get files by id
// // get encrypted string by fileId
// // creation of user, files, groups
// // get all files that contain queried substring