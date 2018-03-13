const router = require('express').Router()
const multer = require('multer')

const Group = require('../models/Group')
const File = require('../models/File')
const User = require('../models/User')

const checkAdmin = require('../utils/adminCheck')
const smartContract = require('../utils/contract-calls')

var filesDir = 'files/'
var upload = multer({ dest: filesDir })
const fs = require('fs')

router.post('/', checkAdmin, upload.single('encryptedData'), async (req, res) => {
  const { name, type, groupId } = req.body
  const { filename } = req.file
  const { addPermission, hasPermission } = await smartContract

  const group = await Group.count({ _id: groupId })
  if (!group) {
    return res.status(400).json({ message: 'There is no such group' })
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
// CREATE

// GET
router.get('/', checkAdmin, async (req, res) => {
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

router.get('/:id', checkAdmin, async (req, res) => {
  const { id } = req.params
  // check if this is admin
  const file = await File.findById(id)
  const group = await Group.findById(file.groupId)
  res.json({...file.toJSON(), group})
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

router.get('/download/:id', async (req, res) => {
  const { id } = req.params
  const { hasPermission } = await smartContract
  console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHH')
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  const file = await File.findById(id)
  const files = await File.find()
  console.log(file, files)
  if (!file) {
    return res.status(404).json({ message: 'File not found' })
  }
  const user = await User.findOne({ zkitId: req.user.zkitId })
  const possession = await hasPermission(user.address, file.filename)

  if (!possession) {
    return res.status(400).json({ message: 'You do not have permissoin for this file' })
  }

  res.download(`${__dirname}/../${filesDir}${file.filename}`)
})

module.exports = router
