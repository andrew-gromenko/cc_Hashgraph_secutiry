const User = require('../models/User')
const smartContract = require('./contract-calls')

const adminCheck = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  const { getAdmin } = await smartContract
  const admin = await getAdmin()
  const { zkitId } = req.user
  const requestOriginator = await User.findOne({ zkitId })
  if (requestOriginator.address !== admin) {
    return res.status(403).json({ message: 'Only admin have privileges for this route' })
  }
  next()
}

module.exports = adminCheck
