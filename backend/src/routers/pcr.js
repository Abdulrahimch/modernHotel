const express = require('express');
const router = new express.Router();
const Pcr = require('../models/pcr');
const cookies = require('../middleware/cookies');
const auth = require('../middleware/auth');
const fetchOrderToGuest = require('../utils/fetchOrderToGuest');

router.get('/pcr', cookies, auth, async(req, res) => {
    console.log('PCr is hitted')
    const pcr = await Pcr.findOne({ propertyId: req.user.propertyId });
    const userStay = { arriveDate: req.user.arriveDate, departDate: req.user.departDate };
    console.log('pcr is: ', pcr);
    res.status(200).json({
        success: {
            items: pcr.items,
            userStay: userStay
        }
    })
});

router.patch('/pcr', cookies, auth, async(req, res) => {
    const pcr = await Pcr.findOne({ propertyId: req.user.propertyId });
    req.body.guest = req.user.name;
    // req.body.roomNumber = req.user.roomNumber;
    pcr.orders = pcr.orders.concat(req.body);
    fetchOrderToGuest(req.body, req.user.userId, 'pcr');

    try {
        await pcr.save();
        res.status(200).send(pcr);
    } catch(e){
        res.send(e);
    }
});

module.exports = router;
