const router = require('express').Router()
const userController = require('../../controllers/api/users')
const checkToken = require('../../config/checkToken')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
/* /api/users
SignUp
*/ 
router.post('/', userController.respondWithToken)

/* 
/api/users/login
Login
 */ 
router.post('/login', userController.login, userController.respondWithToken)

/* 
/api/users/bookmarks
Get Bookmarks by user
*/ 
//use json web token to extract the email and use the email to find the user
//only a logged in user will get their bookmarks
router.get('/bookmarks', checkToken, ensureLoggedIn, userController.getBookmarksByUser, userController.respondWithBookmarks)

module.exports = router