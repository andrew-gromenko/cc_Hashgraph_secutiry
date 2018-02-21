const Group = require('../models/Group')
const File = require('../models/File')
const User = require('../models/User')
const router = require('express').Router()
const adminApi = require('./zkit/adminApi')
const multer = require('multer')
const fs = require('fs')
const checkAdmin = require('./zkit/middleware')
const smartContract = require('../contract-calls')

var filesDir = 'files/'
var upload = multer({ dest: filesDir })

// CREATE
router.post('/groups', checkAdmin, async (req, res) => {
  const { name, tresorId } = req.body

  if (!name || typeof name !== 'string') {
    return res.status(400).json('Invalid groupname')
  }
  if (!tresorId || typeof tresorId !== 'string') {
    return res.status(400).json('Invalid tresorId')
  }

  try {
    const newGroup = await Group.create({ name, tresorId })
    adminApi.approveTresorCreation(tresorId)
    res.json(newGroup.id)
  } catch (err) {
    res.status(400).json(err.message)
  }
})

router.post('/files', checkAdmin, upload.single('encryptedData'), async (req, res) => {
  const { name, type, groupId, zkitId = req.get('ZkitID-Auth') } = req.body
  console.log('ZKIT', zkitId, req.get('ZkitID-Auth'))
  const { filename } = req.file

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Invalid filename' })
  }

  try {
    const newFile = await File.create({ name, type, filename, groupId })
    res.json(newFile.id)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/users', checkAdmin, async (req, res) => {
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
// CREATE

// GET
router.get('/files', checkAdmin, async (req, res) => {
  const { substr } = req.query
  // check if this is admin
  let find = {}
  if (substr) {
    find = { name: { $regex: req.query.substr, $options: 'i' } }

    const files = await File.find(find)
    return res.json(files)
  }

  const files = await File.find(find)
  const filesWithGroup = await Promise.all(files.map(async f => {
    return {...f.toJSON(), group: await Group.findById(f.groupId)}
  }))
  res.json(filesWithGroup)
})

router.get('/files/:id', checkAdmin, async (req, res) => {
  const { id } = req.params
  // check if this is admin
  const file = await File.findById(id)
  const group = await Group.findById(file.groupId)
  res.json({...file.toJSON(), group})
})

router.get('/groups/:id', checkAdmin, async (req, res) => {
  const { id } = req.params

  const group = await Group.findById(id)
  res.json(group)
})

router.get('/download/:id', async (req, res) => {
  const { id } = req.params

  const file = await File.findById(id)

  if (!file) {
    return res.status(404).json({ message: 'File not found' })
  }

  res.download(`${__dirname}/../${filesDir}${file.filename}`)
})

router.get('/groups', async (req, res) => {
  const { userId } = req.query
  let find = {}
  if (userId) {
    find['userIds'] = userId
  }

  const groups = await Group.find(find)

  const groupFiles = await Promise.all(groups.map(async g => {
    let files = await File.find({ groupId: g.id })
    return {...g.toJSON(), files}
  }))
  res.json(groupFiles)
})

router.get('/users', checkAdmin, async (req, res) => {
  const { substr } = req.query
  let find = {}
  if (substr) {
    find = { username: { $regex: req.query.substr, $options: 'i' } }
  }
  const users = await User.find(find)
  res.json(users)
})

router.get('/users/:id', checkAdmin, async (req, res) => {
  const { id } = req.params

  const users = await User.findById(id)
  res.json(users)
})

router.delete('/users/:id', checkAdmin, async (req, res) => {
  const { id } = req.params

  await User.findByIdAndRemove(id)
  await Group.find({ userIds: id }).update({ $pull: { userIds: id } })

  res.status(200).json({})
})

router.delete('/files/:id', checkAdmin, async (req, res) => {
  const { id } = req.params

  const file = await File.findById(id)
  await file.remove(id)
  await fs.unlink(`${__dirname}/../${filesDir}${file.filename}`)
  await Group.find({ fileIds: id }).update({ $pull: { fileIds: id } })

  res.status(200).json({})
})

router.get('/user/count', async (req, res) => {
  const count = await User.count({})

  res.json({count})
})

// GET

// // UPDATE GROUP - add fileId or userId to a group
router.patch('/groups/:groupId', checkAdmin, async (req, res) => {
  const { fileId, userId, operationId } = req.body
  const { groupId } = req.params
  const file = await File.findOne({ _id: fileId })
  const user = await User.findOne({ _id: userId })

  if (typeof fileId !== 'string' && typeof groupId !== 'string' && !fileId && groupId) {
    res.status(400).json({ message: 'Invalid fileId or groupId' })
  }

  const update = {}
  let resp
  if (fileId && typeof fileId === 'string') {
    if (!file) {
      return res.status(400).json({ message: 'Invalid fileId' })
    }
    update['fileIds'] = fileId
    resp = file
  }
  if (userId && typeof userId === 'string') {
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId' })
    }
    await adminApi.approveShare(operationId)
    update['userIds'] = userId
    resp = user
  }

  await Group.findByIdAndUpdate(groupId, { $addToSet: update }, { new: true })
  res.json(resp)
})

// // REMOVE GROUP or remove fileId or userId from a group
router.delete('/groups/:groupId', checkAdmin, async (req, res) => {
  const { fileId, userId, operationId } = req.body
  const { groupId } = req.params

  if (!fileId && !userId) { // Hot fix for group removing. Need to separate from removing fileId or userId
    await Group.findByIdAndRemove(groupId)
    return res.status(200).json({})
  }

  const file = await File.findOne({ _id: fileId })
  const user = await User.findOne({ _id: userId })

  if (typeof fileId !== 'string' && typeof groupId !== 'string' && !fileId && groupId) {
    res.status(400).json({ message: 'Invalid fileId or groupId' })
  }

  const update = {}
  let resp
  if (fileId && typeof fileId === 'string') {
    if (!file) {
      return res.status(400).json({ message: 'Invalid fileId' })
    }
    update['fileIds'] = fileId
    resp = file
  }
  if (userId && typeof userId === 'string') {
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId' })
    }
    await adminApi.approveKick(operationId)
    update['userIds'] = userId
    resp = user
  }

  await Group.findByIdAndUpdate(groupId, { $pull: update })
  res.json(resp)
})

router.get('/admin', async (req, res) => {
  const { getAdmin } = await smartContract
  const admin = await getAdmin()
  const { zkitId } = req.query

  const { address } = await User.findOne({ zkitId })
  res.json({ admin: address === admin })
})

module.exports = router
