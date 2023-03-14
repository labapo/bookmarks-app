const router = require('express').Router()
const bookmarkController = require('../../controllers/api/bookmarks')
const checkToken = require('../../config/ensureLoggedIn')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

/* /api/users/:id
DELETE
destroy bookmark 
*/ 
router.delete('/:id', checkToken, ensureLoggedIn, bookmarkController.destroyBookmark, bookmarkController.respondWithBookmark)
/* /api/bookmarks/:id
PUT
update bookmark */ 
router.put('/:id', checkToken, ensureLoggedIn, bookmarkController.updateBookmark, bookmarkController.respondWithBookmark)

/* /api/bookmarks
POST
create bookmark */ 
router.post('/', checkToken, ensureLoggedIn, bookmarkController.createBookmark, bookmarkController.respondWithBookmark)

module.exports = router
