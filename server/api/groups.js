const router = require('express').Router()

const Group = require('../models/Group')
const File = require('../models/File')
const User = require('../models/User')

const adminApi = require('./admin')
const checkAdmin = require('../utils/adminCheck')
const smartContract = require('../utils/contract-calls')

router.post('/', checkAdmin, async (req, res) => {
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

router.get('/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  const { id } = req.params
  if (id !== 'me') {
    const { getAdmin } = await smartContract
    const admin = await getAdmin()
    const { zkitId } = req.user
    const requestOriginator = await User.findOne({ zkitId })
    if (requestOriginator.address !== admin) {
      return res.status(403).json({ message: 'Only admin have privileges for this route' })
    }
  }
  if (id === 'me') {
    const userGroups = await Group.find({ userIds: req.user.id })

    const userGroupsWithFiles = await Promise.all(userGroups.map(async g => {
      let files = await File.find({ groupId: g.id })
      return {...g.toJSON(), files}
    }))

    res.json(userGroupsWithFiles)
  } else {
    const group = await Group.findById(id)
    res.json(group)
  }
})

router.get('/me', async (req, res) => {
  console.log('me route');
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authorized' })
  }
  const userGroups = await Group.find({ userIds: req.user.id })

  const userGroupsWithFiles = await Promise.all(userGroups.map(async g => {
    let files = await File.find({ groupId: g.id })
    return {...g.toJSON(), files}
  }))

  res.json(userGroupsWithFiles)
})

router.get('/', checkAdmin, async (req, res) => {
  const { userId } = req.query
  let find = {}
  if (userId) {
    find['userIds'] = userId
  }

  const userGroups = await Group.find(find)

  const userGroupsWithFiles = await Promise.all(userGroups.map(async g => {
    let files = await File.find({ groupId: g.id })
    return {...g.toJSON(), files}
  }))
  res.json(userGroupsWithFiles)
})

router.patch('/:groupId', checkAdmin, async (req, res) => {
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
    await files.map(async f => await addPermission(user.address, f.filename))
    res.json(user)
  }
})

router.delete('/:groupId', checkAdmin, async (req, res) => {
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
    await files.map(async f => await removePermission(user.address, f.filename))
    return res.json(up)
  }

  const queryRes = await Group.findById(groupId).select('userIds').populate('userIds')
  const { userIds: users } = queryRes
  await Group.findByIdAndRemove(groupId)
  const files = await File.find({ groupId })
  await File.deleteMany({ groupId })
  await files.map(async f => await users.map(async u => await removePermission(u.address, f.filename)))
  return res.status(200).json({})
})

module.exports = router
