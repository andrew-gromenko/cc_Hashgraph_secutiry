const mongoose = require('mongoose')
const Schema = mongoose.Schema
const smartContract = require('../contract-calls')

/// https://github.com/tresorit/ZeroKit-NodeJs-backend-sample/blob/master/zkitApi/user.js

const registrationInfoSchema = new Schema({
  sessionId: { type: String },
  sessionVerifier: { type: String },
  validationVerifier: { type: String },
  validationCode: { type: String }
})

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
  },
  address: {
    type: String,
    unique: true
  }
}, {
  toJSON: {
    transform (doc, ret, options) {
      // const { getAdmin } = await smartContract
      // const admin = await getAdmin()
      // ret.role = admin === ret.address

      ret.id = ret._id
      delete ret._id
      delete ret.__v
    },
    virtuals: true
  }
})

// const virtual = User.virtual('role')
// virtual.get(function () {
//   smartContract
//   .then(({ getAdmin }) => getAdmin())
//   .then(admin => {
//     return this.address === admin
//   })
// })

const UserModel = mongoose.model('User', User)

module.exports = UserModel
