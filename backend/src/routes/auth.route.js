const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const verifyToken = require('../middleware/verifyRefreshToken')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', verifyToken, authController.logout)
router.get('/user', verifyToken, authController.getMe)

module.exports = router