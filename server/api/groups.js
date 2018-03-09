const router = require('express').Router()

const Group = require('../models/Group')
const File = require('../models/File')
const User = require('../models/User')

const adminApi = require('./admin')
const checkAdmin = require('../utils/adminCheck')
const smartContract = require('../utils/contract-calls')

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

router.get('/groups/:id', checkAdmin, async (req, res) => {
  const { id } = req.params

  const group = await Group.findById(id)
  res.json(group)
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

module.exports = router