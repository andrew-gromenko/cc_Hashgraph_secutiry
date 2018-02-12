const mongoose = require('mongoose')
const Schema = mongoose.Schema

const File = new Schema({
  name: {
    type: String,
    unique: true
  },
  encryptedString: String
})

const FileModel = mongoose.model('File', File)
module.exports = FileModel
