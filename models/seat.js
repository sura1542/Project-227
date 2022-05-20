const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    rowNumber: String

});

module.exports = mongoose.model('seat', seatSchema);