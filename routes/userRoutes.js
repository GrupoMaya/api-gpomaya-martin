const express = require('express')
const router = express.Router()
const { UserController } = require('../controllers')
const { verifyToken } = require('../middlewares/authUser')

router.post('/api/v1/user/login', UserController.login)
router.post('/api/v1/user/register/', UserController.register)
router.get('/api/v1/user/:id', verifyToken, UserController.findUserById)

module.exports = router
