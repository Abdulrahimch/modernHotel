const express = require('express');
const router = express.Router();

const Property = require('../models/property');
const User = require('../models/user');
const Tours = require('../models/tours');
const Shuttle = require('../models/shuttle');
const Pcr = require('../models/pcr');

const tourItems = require ('../utils/toursItems'); 
const shuttleItems =  require ('../utils/shuttleItems'); 
const pcrItems = require('../utils/pcrItems');

const bcrypt = require('bcryptjs');
const cookies = require('../middleware/cookies');
const auth = require('../middleware/auth');

//Subscribing a new hotel.
router.post('/property', async(req, res) => {
    const property = new Property(req.body);

    try{
        await property.save();
        const user = new User(req.body);
        
        const tours = new Tours(req.body);
        tours.items =  tourItems

        const shuttle = new Shuttle(req.body);
        shuttle.items = shuttleItems;

        const pcr = new Pcr(req.body);
        pcr.items = pcrItems;

        user.password = await bcrypt.hash(req.body.password, 8);
        user.propertyId = property.propertyId
        tours.propertyId = property.propertyId
        shuttle.propertyId = property.propertyId
        pcr.propertyId = property.propertyId
        user.account = property.account
        await user.save();
        await tours.save();
        await shuttle.save()
        await pcr.save();
        res.status(201).send();
    } catch(e){
        res.send(e);
    }

});

router.get('/user', cookies, auth, async(req, res) => {
    const property = await Property.findOne({ propertyId: req.user.propertyId });
    console.log(property)
    res.status(200).json({
        success: {
            user: {
                id: property._id,
                email: property.email,
                account: property.account
            }
        }
    })
});

module.exports = router;