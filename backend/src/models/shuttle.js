const mongoose = require('mongoose');
const { Schema } = mongoose;

const shuttleSchema = new Schema({
    propertyName: String,
    propertyId: Number,
    items: 
    [
        {
        title: String,
        price: Number
        }
    ],
    orders: 
    [
        {
            name: String,
            flightNumber: String,
            Ppl: Number,
            selectedDate: Date,
            total: Number,
            airport: String,
            from: String,
            to: String,
            timeZone: Number,

        }
    ]
});

const Shuttle = mongoose.model('Shuttle', shuttleSchema);
module.exports = Shuttle;

    