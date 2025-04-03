const Notification = require('../models/notification.model')

const notificationController = {
    getNotification: async (req, res) => {
        try {
            const userId = req.user.id
            const noti = await Notification.find({ to: userId }).populate({
                path: 'from',
                select: 'username profileImg'
            })
            await Notification.updateMany({ to: req.user.id }, { read: true })
            res.status(200).json(noti)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error })
        }
    },
    delNotification: async (req, res) => {
        try {
            await Notification.deleteMany({ to: req.user.id })
            res.status(200).json({ message: 'Delete notification success' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error })
        }

    }
}

module.exports = notificationController