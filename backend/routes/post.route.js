const router = require('express').Router()
const verifyRefreshToken = require('../middleware/verifyRefreshToken')
const postController = require('../controllers/post.controller')

router.post('/create', verifyRefreshToken, postController.createPost)
router.delete('/:id', verifyRefreshToken, postController.deletePost)
router.post('/comment/:id', verifyRefreshToken, postController.commentPost)
router.post('/like/:id', verifyRefreshToken, postController.likePost)
router.get('/getall', verifyRefreshToken, postController.getAllPost)
router.get('/getlikepost/:id', verifyRefreshToken, postController.getLikePost)
router.get('/following', verifyRefreshToken, postController.getFollowingPost)
router.get('/user/:username', verifyRefreshToken, postController.getUserPost)

module.exports = router