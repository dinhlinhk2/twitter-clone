const userController = require('../controllers/user.controller')
const router = require('express').Router()
const verifyRefreshToken = require('../middleware/verifyRefreshToken')

router.get('/profile/:username', verifyRefreshToken, userController.getUsername)
router.get('/suggested', verifyRefreshToken, userController.getSuggestedUser)
router.post('/follow/:id', verifyRefreshToken, userController.followUser)
router.post('/update', verifyRefreshToken, userController.update)

module.exports = router