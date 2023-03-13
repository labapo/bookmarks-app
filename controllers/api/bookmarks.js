require('dotenv').config()
const Bookmark = require('../../models/bookmark')

//delete bookmark
//create bookmark
//update bookmark

//req, res, next is going to be passed to the next callback functions that we use with express
//req = request
//res = response, respond back to the user once the cycle is complete
//next = used to call the next function
const destroyBookmark = async (req, res, next) => {
    try {
        const deletedBookmark = await Bookmark.findByIdAndDelete(req.params.id)
        res.locals.data.bookmark = deletedBookmark
        next()
    } catch (error) {
        res.status(400).json({ msg: error.message})
    }
}

const updateBookmark = async (req, res, next) => {
    try {
        //new: true = I want the updated new bookmark, not the bookmark before it was updated back. By default, 
        //in the req.body, you'll get back the old bookmark, not the new bookmark that was changed
        const updatedBookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.locals.data.bookmark = updatedBookmark
        next()
    } catch (error) {
        res.status(400).json({ msg: error.message})
    }
}

const createBookmark = async (req, res, next) => {
    try {
        const createdBookmark = await Bookmark.create(req.body)
        res.locals.data.bookmark = createdBookmark
    } catch (error) {
        res.status(400).json({ msg: error.message})
    }
}

module.exports = {
    destroyBookmark,
    updateBookmark,
    createBookmark
}