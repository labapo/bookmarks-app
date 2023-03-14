require('dotenv').config()
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const signUp = async (req, res, next) => {
    try {
        const user = await User.create(req.body)
        const token = createJWT(user)
        res.locals.data.user = user
        res.locals.data.token = token
        next()
    } catch (error) {
        res.status(400).json({ msg: error.message})
    }
}

const login = async (req, res, next) => {
    try {
        //create user variable, where it will use the user schema and find one instance by email. 
        //the email will be found in the request body. 
        const user = await User.findOne({ email: req.body.email })
        //we first have to see if the user and the encrypted password match
        //if we dont see a user, throw a new error
        if(!user) throw new Error('User not found, email was invalid')
        //extra password encryption for security
        const password = crypto.createHmac('sha256', process.env.SECRET).update(req.body.password).digest('hex').split('').reverse().join('')
        //bcrypt.compare = bcrypt's method to compare encrypted passwords
        const match = await bcrypt.compare(password, user.password)
        if(!match) throw new Error('Password did not match')
        res.locals.data.user = user
        res.locals.data.token = createJWT(user)
        next()
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

const getBookmarksByUser = async (req, res, next) => {
    try {
        //look at the email to find a user, and populate all their bookmarks and turn it into an array
        const user = await User.findOne({ email: req.locals.data.email }).populate('bookmarks').sort('bookmarks.createdAt').exec()
        const bookmarks = user.bookmarks
        res.locals.data.bookmarks = bookmarks 
        next()
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

//response controllers - how we're sending back data
const respondWithToken = (req, res) => {
    res.json(res.locals.data.token)
}

const respondWithUser = (req, res) => {
    res.json(res.locals.data.user)
}

const respondWithBookmarks = (req, res) => {
    res.json(res.locals.data.bookmarks)
}
//login user
//create a user
//get user bookmarks


module.exports = {
    signUp,
    login,
    getBookmarksByUser, 
    respondWithToken,
    respondWithUser, 
    respondWithBookmarks
}

//helper function
function createJWT(user){
    //return a jwt web token
    //1st arg what you want to sign it with, then look at the secret in the .env file, and how long the token will be active
    return jwt.sign({ user }, process.env.SECRET, {expiresIn: '48h'})
}