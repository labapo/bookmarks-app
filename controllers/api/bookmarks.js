require('dotenv').config()
const Bookmark = require('../../models/bookmark')
const User = require('../../models/user')

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
//add to set - adds bookmark to user's bookmark arrays
//the createdBookmark is going to wait to get all the bookmark data to create the bookmark
//the user will takethe bookmark and that will be added to the created bookmark variable. 
//the user data is saved that has the new bookmark.
const createBookmark = async (req, res, next) => {
    try {
        const createdBookmark = await Bookmark.create(req.body)
        const user = await User.findOne({ email: res.locals.data.email })
        user.bookmarks.addToSet(createdBookmark)
        await user.save()
        res.locals.data.bookmark = createdBookmark
        next()
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

//response bookmark data
const respondWithBookmark = (req, res) => {
    res.json(res.locals.data.bookmarks)
}

module.exports = {
    destroyBookmark,
    updateBookmark,
    createBookmark, 
    respondWithBookmark
}