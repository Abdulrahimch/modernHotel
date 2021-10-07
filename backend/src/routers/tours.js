const express = require('express');
const router = new express.Router();
const Tours = require('../models/tours');
const User = require('../models/user');
const auth = require('../middleware/auth');
const angularAuth = require('../middleware/angularAuth');
const cookies = require('../middleware/cookies');
const { clearCache } = require('../utils/cache');
const fetchOrderToGuest = require('../utils/fetchOrderToGuest');

router.get('/tours', cookies, auth, async(req, res) => {
    const tours = await Tours.findOne({ propertyId: req.user.propertyId });
    const userStay = {arriveDate: req.user.arriveDate, departDate: req.user.departDate}
    res.json({
        success: {
            items: tours.items,
            userStay: userStay
        }
    })
    // res.send(tours.items);
});

router.patch('/tours', cookies, auth, async(req, res) => {
    const tours = await Tours.findOne({ propertyId: req.user.propertyId });
    req.body.userId = req.user.userId;
    req.body.guest = req.user.name;
    // req.body.roomNumber = req.user.roomNumber;
    tours.orders = tours.orders.concat(req.body);
    console.log(tours.orders)
    fetchOrderToGuest(req.body, req.user.userId, 'tour');

    try {
        await tours.save();
        res.send(tours);
    } catch(e){
        res.send(e);
    }
});

router.patch('/tours/prices', cookies, auth, async(req, res) => {
    const tours = await Tours.findOne({ propertyId: req.user.propertyId });
    const allPrices = req.body
    console.log('all prices are: ', allPrices)
    console.log('tours are: ', tours);
    console.log('tous.items are: ', tours.items)
    let prices_list = []
    tours.items.map((item) => {
        prices = allPrices[JSON.stringify(item.id)]
        item.adultPrice = prices[0]
        item.childPrice = prices[1]
    })
    try {
        tours.save()
    } catch (err){
        console.log(err)
    }
    res.status(200).json({
        success: {
            msg: 'The prices is updated successfully!'    
        }
    })
})

router.get('/my/tours', cookies, auth, async(req, res) => {
    const user = await User.findOne({ userId: user.userId });
    res.send({ orders: user.orders });
})

router.patch('/tours/:_id', angularAuth, auth, async(req, res) => {
    const tours = await Tours.findOne({ hotelId: req.user.hotelId });
    tours.orders.forEach( async(order) => {
        if(order._id.toString() === req.params._id){
            index = tours.orders.indexOf(order);
            tours.orders.splice(index, 1);
            // fetching order to guest account
            fetchOrderToGuest(order, req.user.name);

        }
    });

    try{
        await tours.save();
        res.status(200).send()
    } catch(e) {
        res.send(e);
    }
});

router.put('/tours', angularAuth, auth, async(req, res) => {
   const tours = await Tours.findOne({ propertyId: req.user.propertyId });
   tours.items = req.body.items;
   try {
        await tours.save();
        res.send(tours.items)
   } catch(e){
        res.send(e);
   }
   //clearCache({ propertyId: req.user.propertyId, collection: "tours" });
});

module.exports = router;