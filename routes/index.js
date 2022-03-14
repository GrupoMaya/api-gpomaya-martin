const express = require('express')
const router = express.Router()

router.use(require('./publicRoutes'))
router.use(require('./userRoutes'))

module.exports = router
