const mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    tourOrders:[],
    shuttleOrders: [
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
    ],
    pcrOrders: [],
    email: {
        type: String,
        lowercase: true,
        //unique: true,
        required: true,
        trim: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    propertyId: {
        type: Number,
    },

    // Rez No is the same
    userId: String,
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if (value.includes('password')){
                throw new error('Password can not contain password')
            }
        }
    },
    shuttleTotal: Number,
    toursTotal: Number,
    pcrTotal: Number,
    total: Number,
    account:{
        type: String,
        enum: ['guest', 'staff', 'hotelManager'],
        trim: true
    },

    department:{
        type: String,
        enum: ['house keeping', 'room service', 'bellboy'],
        trim: true,
        validate(){
            if (this.account !== 'staff'){
                throw new Error('Sorry, Not allowed')
            }
        }
    },
    // ToDo Labeling "Room_number" as required on SuperUser HTML page.
    roomNumber:{
        type: Number,
    },
    mobile:{
        type: Number,
    },
    arriveDate:{
        type: Date
    },
    departDate: {
        type: Date
    },
    joiningDate: {
        type: Date
    },
    address: {
        type: String,
        trim: true
    },

    propertyName: {
        type: String,
        trim: true,
    },
    lockStatus: {
        type: String,
        trim: true
    },
    note: String,
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }]
})


userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.token

    return userObject
}

userSchema.methods.generateAuthToken = async function ()  {
    const user = this
    const token = jwt.sign({ _id : user._id.toString() }, process.env.JWT_SECRET,
                           { expiresIn: '3h' })
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

//ToDo login shld be via hotelId or hotelEmail and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email, account: 'hotelManager' })
    if (!email){
        throw new Error (`unable to login`)
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error(`Unable to login`)
    }

    return user
}

userSchema.statics.findGuestsByCredentials = async(userId, password) => {
    const user = await User.findOne({ userId });
    if(!user){
        console.log('user not exist')
        throw new Error(`Unable to login`);
    }
    const isMatch = (password === user.password);
    if (!isMatch){
        console.log('password is wrong')
        throw new Error(`Unable to login`);
    }
    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;
    console.log(`the user is: ${user.orders}`);
    let total = 0
    let toursTotal = 0
    let shuttleTotal = 0
    let pcrTotal = 0

    user.shuttleOrders.map(item => { 
        shuttleTotal += item.total
        total += item.total
    })

    user.tourOrders.map(item => { 
        toursTotal += item.total
        total += item.total
    })

    user.pcrOrders.map(item => { 
        pcrTotal += item.total
        total += item.total
    })

    user.shuttleTotal = shuttleTotal;
    user.toursTotal = toursTotal;
    user.pcrTotal = pcrTotal;
    user.total = total;
    console.log(`Total is ${total} shuttleTotal is: ${shuttleTotal} toursTotal: ${toursTotal}`)
    next();
})
// user.shuttleOrders.map(item => shuttleTotal += item.total)
//     user.tourOrders.map(item => toursTotal += item.total)
const User = mongoose.model('Users', userSchema)

module.exports = User