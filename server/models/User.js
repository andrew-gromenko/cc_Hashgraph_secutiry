const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  username: {
    type: String,
    unique: true
  }
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

const UserModel = mongoose.model('User', User)
module.exports = UserModel
