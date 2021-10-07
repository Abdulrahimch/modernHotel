const mongoose = require('mongoose');
const { Schema } = mongoose;

const tourSchema = new Schema({
    propertyName: String,
    propertyId: Number,
    items: 
        [
            {
                _id: { type: Schema.Types.ObjectId },
                id: Number,
                title: String,
                subTitle: String,
                imgURL: String,
                toURL: String,
                tourType: String,
                adultPrice: Number,
                childPrice: Number,
                shuttlePrice1: Number,
                shuttlePrice2: Number,
                shuttlePrice3: Number,
                shuttlePrice4: Number,
                lable: String
            }
        ],        
    orders: [
        {
            //userId: String,
            guest: String,
            adultsNo: String,
            adultTotal: Number,
            chdNo: String,
            chdTotal: Number,
            title: String,
            total: Number,
            //roomNumber: Number,
            selectedDate: Date,
            // numberOfPpl: Number
        }
    ]
});

const Tours = mongoose.model('Tours', tourSchema);
module.exports = Tours;