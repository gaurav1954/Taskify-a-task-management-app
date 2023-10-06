const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        }
    ]
})
userSchema.statics.findAndValidate = async function (username, password) {
    const user = await this.findOne({ username });
    console.log(user)
    if (!user)
        return null
    const isValid = await bcrypt.compare(password.trim(), user.password)
    console.log(isValid)
    return isValid ? user : false;
}

module.exports = mongoose.model('User', userSchema)