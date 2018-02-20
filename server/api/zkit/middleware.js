const User = require('../../models/User')
const smartContract = require('../../contract-calls')

const adminCheck = async (req, res, next) => {
  const { getAdmin } = await smartContract
  const admin = await getAdmin()
  const zkitId = req.get('Authorization')
  console.log(zkitId)
  if (!zkitId) {
    return res.status(400).json({ message: 'You have to provide your zkitid in request payload' })
  }
  const requestOriginator = await User.findOne({ zkitId })
  if (requestOriginator.address !== admin) {
    return res.status(400).json({ message: 'Only user have privileges to create user' })
  }
  next()
}

module.exports = adminCheck
