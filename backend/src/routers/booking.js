const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const angularAuth = require('../middleware/angularAuth')
const cookies = require('../middleware/cookies');
const auth= require('../middleware/auth')
const generator = require('generate-password');
// sendEmail = require('../utils/sendEmail');
const passport = require('passport')

router.route('/auth/google',
    passport.authenticate('google', { scope : ['email', 'profile'] }));

router.post('/booking', angularAuth, auth, async (req, res) => {
// resetting arrive and depart times
// Ckeck-in time is at 14:00
// Check-out time is at 12:00
    let arriveDateTurkey = new Date(req.body.arriveDate);
    let departDateTurkey = new Date(req.body.departDate);
    req.body.arriveDate = arriveDateTurkey.setTime(arriveDateTurkey.getTime() + (17*60*60*1000));
    req.body.departDate = departDateTurkey.setTime(departDateTurkey.getTime() + (15*60*60*1000));

    let password = generator.generate({
    length: 10,
    numbers: true
});

    const user = new User(req.body);
    console.log(req.body)
    console.log('here is the test')
    user.userId = (user.name + JSON.stringify(user._id).slice(-4)).slice(0, -1);
    user.propertyId = req.user.propertyId;
    user.propertyName = req.user.propertyName;
    user.password = password;

    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch(e) {
        console.log(e);
        res.status(400).send(e);
    }
});

router.patch('/booking', angularAuth, auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['_id', 'name' ,'email', 'arriveDate', 'departDate', 'roomNumber'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (! isValidOperation){
        return res.status(404).send({ error : 'Invalid Update' });
    }

    let user = await User.findOne({ _id: req.body._id });
    if (!user){
        return res.status(404).send({ error: 'booking not found' });
    }

    if (req.body.arriveDate){
        var arriveDateTurkey = new Date(req.body.arriveDate);
        req.body.arriveDate = arriveDateTurkey.setTime(arriveDateTurkey.getTime() + (17*60*60*1000));
    }

    if (req.body.departDate){
        var departDateTurkey = new Date(req.body.departDate);
        req.body.departDate = departDateTurkey.setTime(departDateTurkey.getTime() + (15*60*60*1000));
    }



    try{
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        res.status(200).send();
    }catch(e){
        res.status(400).send(e);
    }
});

router.patch('/booking/lockstatus', angularAuth, auth, async(req, res) => {
    const user = await User.findOne({ _id: req.body._id });
    if(!user){
        return res.status(404).send({ error: `booking not found` });
    }
    user.lockStatus = req.body.lockStatus;
    try{
        await user.save();
        res.status(200).send();
    } catch(e){
        res.status(400).send(e);
    }
});

// router.delete('/booking/_id', async(req, res) => {
    router.delete('/booking/:_id', async(req, res) => {
    console.log('delete is hitted');
    console.log(`the  res pra,as is: ${typeof(req.params._id)}`)
    const user = await User.findOne({ _id: req.params._id });
    if (!user){
        console.log('here is Error from Delete')
        return res.status(404).send({ error: 'Booking not found' });
    }

    try{
        await user.remove();
        // res.send(user);
        res.status(200).json({
            success: {
                user: user
            }
        });
    }catch(e){
        res.status(500).send();
    }
});

// retrieve all bookings.
router.get('/booking', cookies, auth, async(req, res) => {
    let guests = [];
    const allGuests = await User.find({ propertyId: req.user.propertyId });
    // const allGuests = await User.find({ propertyId: 1000001 });
    let bookings = []
    let id = 0;
        for (booking of allGuests){
            if (booking.account === 'guest'){
                id++
                arriveDate = JSON.stringify(booking.arriveDate).slice(1, 11);
                departDate = JSON.stringify(booking.departDate).slice(1, 11);
                bookings.push({
                    _id: booking._id, 
                    id,
                     name: booking.name, 
                     email: booking.email, 
                     arriveDate, 
                     departDate, 
                     orders: 
                     booking.orders, 
                     shuttleTotal: booking.shuttleTotal,
                     toursTotal: booking.toursTotal,
                     total: booking.total
                })
            }
        }
        res.status(200).json(bookings)
});

//router.get('/today/checkIn', angularAuth, auth, async(req, res) => {
router.get('/todayscheckin', angularAuth, auth, async(req, res) => {
    allBookings = await User.find({ propertyId: req.user.propertyId });
    todaysCheckIn = [];
    let id = 0;
    for (booking of allBookings){
        let checkInDay = new Date(booking.arriveDate);
        let today = new Date();
        checkInFormatYMD = JSON.stringify(checkInDay).slice(1, 11);
        todayFormatYMD = JSON.stringify(today).slice(1, 11);

        if (checkInFormatYMD === todayFormatYMD){
            todaysCheckIn.push(booking);
            id++;
         }
        }
        console.log(todaysCheckIn);
        res.status(200).json(todaysCheckIn);
});

router.get('/booking/counters', angularAuth, auth, async(req, res) => {
    let propertyId = req.user.propertyId;
    let checkInCounter = 0;
    let checkOutCounter = 0;
    let today = new Date();
    let todayFormatYMD = JSON.stringify(today).slice(1, 11);

    allBookings = await User.find({ propertyId });
    console.log(allBookings)
    for (booking of allBookings){
        let checkInDay = new Date(booking.arriveDate);
        let checkInFormatYMD = JSON.stringify(checkInDay).slice(1,11);
        let checkOutDay = new Date(booking.departDate);
        let checkOutFormatYMD = JSON.stringify(checkOutDay).slice(1, 11);

        if (checkInFormatYMD === todayFormatYMD){
            checkInCounter++;
        }

        if (checkOutFormatYMD === todayFormatYMD){
             checkOutCounter++;
        }

    }
    console.log(`todays check-in is: ${checkInCounter}`);
    console.log(`Todays check-out is: ${checkOutCounter}`);
    res.status(200).json([{ checkInCounter },{ checkOutCounter }]);
});

router.get('/today/checkOut', angularAuth, auth, async(req, res) => {
    allBookings = await User.find({ propertyId: req.user.propertyId });
    todaysCheckOut = [];
    let id = 0;
    for (booking of allBookings){
        let checkOutDat = new Date(booking.departDate);

        let today = new Date();
        console.log('todays hour is ', today.getHours());
        checkOutFormatYMD = JSON.stringify(checkOutDat).slice(1, 11);
        todayFormatYMD = JSON.stringify(today).slice(1, 11);

        if (checkOutFormatYMD === todayFormatYMD){
            todaysCheckOut.push(booking);
            id++;
         }

    for (booking of todaysCheckOut) {
        if (today.getHours() >= 10) {
            booking.lockStatus = 'lock';
            await booking.save();
            }
        }
    }
    res.status(200).send(todaysCheckOut);
});



module.exports = router;