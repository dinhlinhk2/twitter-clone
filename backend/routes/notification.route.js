const router = require('express').Router()
const notificationController = require('../controllers/notification.controller')
const verifyToken = require('../middleware/verifyRefreshToken')

router.get('/', verifyToken, notificationController.getNotification)
router.delete('/', verifyToken, notificationController.delNotification)

module.exports = router