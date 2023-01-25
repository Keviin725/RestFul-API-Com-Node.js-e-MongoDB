const mongoose = require('mongoose')

const Person = mongoose.model('Person', {
   // _id: String,
    name: String,
    age: Number,
    cellphone: Number,
    address: String,
    approved: Boolean
})

module.exports = Person