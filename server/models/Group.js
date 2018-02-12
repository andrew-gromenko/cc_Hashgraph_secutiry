const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Group = new Schema({
  name: {
    type: String,
    unique: true
  },
  tresorId: String,
  userIds: [String],
  fileIds: [String]
})

const GroupModel = mongoose.model('Group', Group)
module.exports = GroupModel
