const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const highscoreSchema = Schema({
    name: String,
    points: Number
})

module.exports = mongoose.model('Highscore', highscoreSchema)