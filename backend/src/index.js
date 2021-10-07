require('./db/mongoose');
const User = require('./models/user');
const express = require('express');
const path = require('path');
const userRouter = require('./routers/user');
// const mqttSubRouter = require('./routers/mqttSub');
const bookingRouter = require('./routers/booking');
const awsMqtt = require('./routers/awsMqtt');
const cookieParser = require('cookie-parser');
const mqttDoorPubRouter = require('./routers/mqttDoorPub');
const propertyRouter = require('./routers/property');
const tours = require('./routers/tours');
const shuttle = require('./routers/shuttle');
const pcr = require('./routers/pcr');

require('./middleware/oauth2');
const passport = require('passport');
const session = require('express-session')
//const isLoggedIn = require('./middleware/isOauthLoggedIn');
// ToRemove
const generator = require('generate-password');


//ToDo this func apply some changes before sending query to MongoDB
require('./utils/cache');


app = express()

// Automatically parse incoming json to an object.
app.use(express.json())

app.use(session({ secret: 'cats' }))
app.use(passport.initialize());
app.use(passport.session())

app.use(cookieParser());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-requested-with, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(userRouter);
app.use(bookingRouter);
//app.use(mqttDoorPubRouter);
//app.use(awsMqtt);
app.use(propertyRouter);
// app.use(uploadRoutesRouter);
app.use(tours);
app.use(shuttle);
app.use(pcr);

const pathViews = path.join(__dirname, '../templates/views')
const publicDirPath = path.join(__dirname, '../public/')
app.use(express.static(publicDirPath))

app.set('view engine', 'hbs')
app.set('views', pathViews)

app.get(`/test2`, (req, res) => {
    res.render('test2')
})

// Middleware for being sure it is logged in.
const isLoggedIn = function (req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/protected', isLoggedIn, async (req, res) => {

    let user = await User.findOne({ email: req.user.email })
    // think how to add token to user profile
    if (!user) {
        user = new User({ name: req.user.displayName, email: req.user.email })
        user.password = generator.generate({ length: 10, numbers: true })
        try{
            await user.save()
        } catch(err) {
            res.send(err)
        }
        res.status(201).json({
          success: {
            user: {
              id: user._id,
              username: user.username,
              email: user.email
            }
          }
        });
    }
    else {
        res.status(200).json({
          success: {
            user: {
              id: user._id,
              username: user.username,
              email: user.email
            }
          }
        });
    }
});

//app.get('/auth/google',
//    passport.authenticate('google', { scope : ['email', 'profile'] }))

app.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/protected',
        failureRedirect: '/failure'
}));

app.get('/logout', (req, res) => {
    req.logout()
    req.session.destroy()
    res.send('GoodBye')
})

module.exports = app