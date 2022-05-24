const   mongoose = require('mongoose');
 

const ticketSchema = new mongoose.Schema({
    
    box:    {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Box'
            },
    cinema:   {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'cinema'
            },
    seat:   {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'seat'
            }
});

module.exports = mongoose.model('Ticket',ticketSchema);