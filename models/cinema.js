const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
    cinemaname: String

});

module.exports = mongoose.model('cinema', cinemaSchema);