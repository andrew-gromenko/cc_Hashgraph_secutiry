const mongoose = require('mongoose')
const Schema = mongoose.Schema

const File = new Schema({
  name: {
    type: String,
    unique: true
  },
  encryptedString: String,
  groupId: Schema.Types.ObjectId
}, {
  toJSON: {
    transform (doc, ret, options) {
      // remove the _id of every document before returning the result
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    }
  }
})

const FileModel = mongoose.model('File', File)
module.exports = FileModel
