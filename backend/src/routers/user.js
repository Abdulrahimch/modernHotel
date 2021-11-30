const express = require('express');
const router = new express.Router();
const User = require('../models/user');
 const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const bodyParser = require('body-parser');
const cookies = require('../middleware/cookies');
const header = require('../middleware/cors');
const angularAuth = require('../middleware/angularAuth');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.use(express.json());

// this api to test login/logout process
router.get('/test', async (req, res) =>{
    console.log('this user is authenticated')
    res.status(200).send("this user is authenticated")
});

// Create a User
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    console.log(req.body);
    // Encrypt the password only if the account belongs to hotelManager
    if (user.account === 'hotelManager'){
        user.password = await bcrypt.hash(req.body.password, 8);
    }

    try{
        await user.save();
        console.log('Saved properly');
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e)  {
        res.status(400).send(e);
    }
})

router.post('/login', urlencodedParser ,async(req, res) => {
    try{
        //ToDO Entering req.body.hotelName after adding search bar to Login page.
        console.log('/login is hitted')
        console.log(req.body)
        // const user = await User.findByCredentials(req.body.email, req.body.password);
        const user = await User.findByCredentials( req.body.email, req.body.password );
        console.log('the user is: ', user)
        const token = await user.generateAuthToken();
        res.cookie(`jwt`, token);
        res.status(200).json({
            success: {
                user: {
                    id: user._id,
                    email: user.email,
                    account: user.account
                }
            }
        })
    } catch(e) {
        console.log(e);
        res.status(400).send(e);
    }

});

router.post('/login/guest', urlencodedParser, async(req, res) => {
   try{
        const user = await User.findGuestsByCredentials(req.body.userId, req.body.password);
        const token = await user.generateAuthToken();
        res.cookie(`jwt`, token);
        res.status(200).json({
            success: {
                user: {
                    id: user._id,
                    userId: user.userId,
                    email: user.email,
                    account: user.account
                }
            }
        })
   } catch(e){
        console.log(e)
        res.status(400).send(e);
   }
})

// logOuthotelManagers
router.post('/users/logout', angularAuth, auth, async(req, res) => {
    try {
        console.log('logout is hitted')
        req.user.tokens = req.user.tokens.filter((token) =>  token.token !== req.token);
        await req.user.save();
        res.send()
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users/logoutall', angularAuth, auth, async(req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch(e){
        res.status(500).send(e);
    }
});

router.post('/guests/logout', cookies, auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) =>  token.token !== req.token);
        await req.user.save();
        res.send()
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/guests/logoutall', cookies, auth, async(req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch(e){
        res.status(500).send(e);
    }
});

router.patch('/users/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) return res.status(404).send({ error: 'Invalid update' });

    const user = await User.findById({ _id: req.params.id });
    if (!user) return res.status(404).send({ error: "User not found" });

    try{
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/auth/user', cookies, auth, async(req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(401);
        throw new Error("Not authorized");
    }
    
    res.status(200).json({
        success: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        }
    })
});

router.get('/orders', cookies, auth, async(req, res) => {
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404)
        throw new Error("Not Found")
    }
    res.status(200).json({
        success: {
            tourOrders: user.tourOrders,
            shuttleOrders: user.shuttleOrders,
            pcrOrders: user.pcrOrders
        }
    });
})

router.delete('/order', cookies, auth, async(req, res) => {
    const user = await User.findById(req.user._id)

    switch (req.body.type) {
        case 'tour':
            user.tourOrders.forEach((item, index) => {
                if (req.body.id === item.id) user.tourOrders.splice(index, 1)
            })
            break;
        case 'shuttle':
            user.shuttleOrders.forEach((item, index) => {
                if (req.body.id === item.id) user.shuttleOrders.splice(index, 1)
            })
            break;
        case 'pcr':
            user.pcrOrders.forEach((item, index) => {
                if (req.body.id === item.id) user.pcrOrders.splice(index, 1)
            })
            break;
        default:
            break;
    }

    try { 
        await user.save()
        res.status(200).json({
            success: {
                user
            }
        })
    } catch(e) {
        console.log(e)
    }

    
})

module.exports = router

