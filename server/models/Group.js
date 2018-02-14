const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Group = new Schema({
  name: {
    type: String,
    unique: true
  },
  tresorId: String,
  userIds: [{ type: Schema.Types.ObjectId, ref: 'Uesr' }],
  fileIds: [{ type: Schema.Types.ObjectId, ref: 'File' }]
})

Schema.options = { toJSON: {} }
Schema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id
  delete ret._id
  delete ret.__v
}

const GroupModel = mongoose.model('Group', Group)
module.exports = GroupModel
