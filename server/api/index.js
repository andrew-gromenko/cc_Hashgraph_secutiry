const router = require('express').Router()

router.use('/user', require('./users'))
router.use('/group', require('./groups'))
router.use('/file', require('./files'))
router.use('/auth', require('./auth'))

module.exports = router
