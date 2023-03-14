require('dotenv').config()
require('./config/database')

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json())
app.use((req, res, next) => {
    res.locals.data = {}
    next()
})
//dev mode
app.use(logger('dev'))


//dirname represents whatever directory we happen to be in, like a placeholder for where it will eventually be
//when in production the application it makes it easy because dirname is a general name for where the directory will be in
//not sure what favicon does
//it'll look into the build folder to find the favicon
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico' )))
//static the build folder
//anything in the build folder we'll serve statically, anything in the build folder will be shown
app.use(express.static(path.join(__dirname, 'build')))

app.use('/api/users', require('./routes/api/users'))
app.use('/api/bookmarks', require('./routes/api/bookmarks'))

//catch all for our react application
//if we try to get something from the site that's not a static site or api, it automatically sends you the index.hmtl which is where react app will be
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`I am listening on Port: ${PORT}`)
})