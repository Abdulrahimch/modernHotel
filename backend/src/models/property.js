const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const User = require('./user')

const propertySchema = new mongoose.Schema({
    propertyId: {
        type: Number,
        unique: true
    },
    ownerUsername: String,
    propertyName: {
        type: String,
        unique: true
    },
    country: String,
    city: String,
    propertyAddress: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Invalid email address')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value){
            if (value.includes('password')){
                throw new error('Password can not contain password')
            }
        }
    },
    account: {
        type: String,
        trim: true,
        default: 'hotelManager'
    }
});

propertySchema.pre('save', async function (next) {
    const user = this;
    try{
        const sortedProperties = await User.find({}).sort({ propertyId: 1 });
        if (sortedProperties.length > 0){
            const largestProId = sortedProperties[sortedProperties.length -1];
            const newProId = largestProId.propertyId + 1;
            user.propertyId = newProId;
        }else{
            user.propertyId = 1000001
        }
    } catch(e){
        console.log(e)
    }

    next();
});

propertySchema.index({ propertyId: 1, propertyName: 1 }, { unique: true });

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;