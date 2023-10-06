const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    duedate: Date,
    priority: String,
    comments: String,
})
module.exports = mongoose.model('Task', taskSchema)