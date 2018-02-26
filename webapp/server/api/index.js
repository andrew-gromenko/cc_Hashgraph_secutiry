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
  const { name, type, groupId } = req.body
  const { filename } = req.file
  const { addPermission, hasPermission } = await smartContract

  const group = await Group.count({ _id: groupId })
  if (!group) {
    return res.status(400).json({ message: 'There is no such group'})
  }
  if (!type || typeof type !== 'string') {
    return res.status(400).json({ message: 'Invalid type' })
  }
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Invalid filename' })
  }
  try {
    const newFile = await File.create({ name, type, filename, groupId })
    const { userIds } = await Group.findById(groupId).select('userIds')
    const addresses = await User.find({ _id: userIds }).select('address')
    await addresses.map(async ({ address: a }) => {
      const perm = await addPermission(a, filename)
      const hasPerm = await hasPermission(a, filename)
      console.log('hasPerm, upload: ', hasPerm)
      return perm
    })
    console.log(userIds, addresses)
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
  const zkitId = req.get('ZkitID-Auth')
  const { hasPermission } = await smartContract
  console.log(zkitId)

  if (!zkitId) {
    return res.status(400).json({ message: 'You should provide zkitId' })
  }

  const file = await File.findById(id)
  if (!file) {
    return res.status(404).json({ message: 'File not found' })
  }

  const user = await User.findOne({ zkitId })
  const possession = await hasPermission(user.address, file.filename)

  console.log('Possesion: ', possession)
  if (!possession) {
    return res.status(400).json({ message: 'You do not have permissoin for this file' })
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
  const { removePermission, hasPermission } = await smartContract

  const removedFile = await File.findByIdAndRemove(id)
  await fs.unlink(`${__dirname}/../${filesDir}${removedFile.filename}`)
  const { userIds: users } = await Group.findById(removedFile.groupId).select('userIds').populate('userIds')
  console.log(users)
  await users.map(async u => {
    console.log('HERERERER')
    const a = await hasPermission(u.address, removedFile.filename)
    const b = await removePermission(u.address, removedFile.filename)
    const c = await hasPermission(u.address, removedFile.filename)
    console.log(a, b, c)
    return b
  })
  console.log('Removed File: ', removedFile)

  res.status(200).json({})
})

router.get('/user/count', async (req, res) => {
  const count = await User.count({})

  res.json({count})
})

// GET

// // UPDATE GROUP - add fileId or userId to a group
router.patch('/groups/:groupId', checkAdmin, async (req, res) => {
  const { userId, operationId } = req.body
  const { groupId } = req.params
  const { addPermission, hasPermission } = await smartContract

  if (typeof groupId !== 'string' && groupId) {
    res.status(400).json({ message: 'Invalid fileId or groupId' })
  }

  if (userId && typeof userId === 'string') {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId' })
    }
    await adminApi.approveShare(operationId)
    await Group.findByIdAndUpdate(groupId, { $addToSet: { userIds: userId } }, { new: true })
    const files = await File.find({ groupId })
    await files.map(async f => {
      const perm = await addPermission(user.address, f.filename)
      const hasPerm = await hasPermission(user.address, f.filename)
      console.log('hasPerm, groupChange: ', hasPerm)
      return perm
    })
    res.json(user)
  }
})

router.delete('/groups/:groupId', checkAdmin, async (req, res) => {
  const { userId, operationId } = req.body
  const { groupId } = req.params
  const { removePermission, hasPermission } = await smartContract

  if (typeof groupId !== 'string' && groupId) {
    res.status(400).json({ message: 'Invalid groupId' })
  }

  if (userId && typeof userId === 'string') {
    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(400).json({ message: 'Invalid userId' })
    }
    await adminApi.approveKick(operationId)
    const up = await Group.findByIdAndUpdate(groupId, { $pull: { userIds: userId } }, { new: true })
    const files = await File.find({ groupId })
    await files.map(async f => {
      const before = await hasPermission(user.address, f.filename)
      const rem = await removePermission(user.address, f.filename)
      const after = await hasPermission(user.address, f.filename)
      console.log(before, rem, after)
      return rem
    })
    console.log('Files: ', files)
    return res.json(up)
  }

  const queryRes = await Group.findById(groupId).select('userIds').populate('userIds')
  const { userIds: users } = queryRes
  await Group.findByIdAndRemove(groupId)
  const files = await File.find({ groupId })
  await File.deleteMany({ groupId })
  console.log('queryRes', queryRes)
  await files.map(async f => {
    await users.map(async u => {
      const before = await hasPermission(u.address, f.filename)
      const rem = await removePermission(u.address, f.filename)
      const after = await hasPermission(u.address, f.filename)
      console.log('Group deletion', before, rem, after)
    })
  })
  console.log(files)
  return res.status(200).json({})
})

router.get('/admin', async (req, res) => {
  const { getAdmin } = await smartContract
  const admin = await getAdmin()
  const { zkitId } = req.query

  const { address } = await User.findOne({ zkitId })
  res.json({ admin: address === admin })
})

module.exports = router
