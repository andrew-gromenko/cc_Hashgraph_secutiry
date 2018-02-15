const mongoose = require('mongoose')
const Schema = mongoose.Schema

/// https://github.com/tresorit/ZeroKit-NodeJs-backend-sample/blob/master/zkitApi/user.js

const registrationInfoSchema = new Schema({
  sessionId: { type: String },
  sessionVerifier: { type: String },
  validationVerifier: { type: String },
  validationCode: { type: String }
});

const User = new Schema({
  username: {
    type: String,
    required: true, 
    unique: true
  },
  zkitId: {
    type: String,
    unique: true
  },
  registrationData: {
    type: registrationInfoSchema
  },
  state: {
    type: Number,
    required: true
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
