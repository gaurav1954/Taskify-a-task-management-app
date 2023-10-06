const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/users')
const Task = require('./models/task')
const ejsMate = require('ejs-mate')
const path = require('path')
const all = require("./router/routes")
mongoose.connect('mongodb://127.0.0.1:27017/taskify')
    .then(() => {
        console.log("sucessful  connection")
    })
    .catch((err) => {
        console.log("failed mongo connection", err)
    })
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')))
const session = require('express-session')
const flash = require('express-flash');

app.use(session({
    secret: 'thisIsJustDumb',
    saveUninitialized: false,
    resave: false   //this is like signing the cookie
}))
app.use(flash());
app.use('/', all)

app.listen(8000, () => {
    console.log("App up and running")
})