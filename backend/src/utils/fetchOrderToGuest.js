const User = require('../models/user');
const generator = require('generate-password');


const fetchOrderToGuest = async function(order, userId, type){
//    let orderObj = order.toObject;
//    orderObj.staffName = staffName;
    const user = await User.findOne({ userId: userId });
    const id = generator.generate({
        length: 10,
        numbers: true
    });
    if (type === 'tour') { 
        order.id = Math.random().toString(36).substr(2, 9);
        user.tourOrders = user.tourOrders.concat(order);
    }
    else if (type === 'shuttle') { 
        order.id = Math.random().toString(36).substr(2, 9);
        user.shuttleOrders = user.shuttleOrders.concat(order);
    }
    else {
        order.id = Math.random().toString(36).substr(2, 9);
        user.pcrOrders = user.pcrOrders.concat(order)
    }
    try{
        await user.save();
    } catch(e) {
        console.log(e);
    }
}

module.exports = fetchOrderToGuest;