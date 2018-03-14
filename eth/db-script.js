const mongoose = require('mongoose')

const main = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URI, {
      auth: {
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASS
      }
    })
    mongoose.connection.once('open', () => {
      console.log('Connected to DB')
      mongoose.connection.dropDatabase(() => {
        console.log('db droped');
        mongoose.connection.close(() => {
          console.log('connection is closed after db purge');
          resolve()
        })
      })
    })
  })
}

module.exports = main()