const mongoose = require('mongoose')

const User = mongoose.model('User', {
   // _id: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    cellphone: Number,
    address: String,
    approved: Boolean
})

module.exports = User