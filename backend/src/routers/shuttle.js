const express = require('express');
const router = new express.Router();
const Shuttle = require('../models/shuttle');
const cookies = require('../middleware/cookies');
const angularAuth = require('../middleware/angularAuth');
const auth = require('../middleware/auth');
const fetchOrderToGuest = require('../utils/fetchOrderToGuest');


router.get('/shuttle', cookies, auth, async(req, res) => {
    const shuttle = await Shuttle.findOne({ propertyId: req.user.propertyId })
    const userStay = {arriveDate: req.user.arriveDate, departDate: req.user.departDate}
    
    res.json({
        success: {
            items: shuttle.items,
            userStay: userStay
        }
    })
    // res.send(shuttle.items);
});

router.patch('/shuttle', cookies, auth, async(req, res) => {
    const shuttle = await Shuttle.findOne({ propertyId: req.user.propertyId });
    req.body.guest = req.user.name;
    // req.body.roomNumber = req.user.roomNumber;
    shuttle.orders = shuttle.orders.concat(req.body);
    fetchOrderToGuest(req.body, req.user.userId, 'shuttle');

    try {
        await shuttle.save();
        res.status(200).send(shuttle);
    } catch(e){
        res.send(e);
    }
});

module.exports = router
