const mongoose = require('mongoose');

const pcrSchema = new mongoose.Schema({
    propertyName: String,
    propertyId: Number,
    items: 
        {
            title: String,
            price: Number,
            currency: String
        },
    orders: 
        [
            {
                name: String,
                Ppl: Number,
                selectedDate: Date,
                total: Number
            }
        ]
})

const Pcr = mongoose.model('Pcr', pcrSchema);

module.exports = Pcr

