const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const notesSchema = Schema({
    name: String,
    points: Number
})

module.exports = mongoose.model('Notes', notesSchema)