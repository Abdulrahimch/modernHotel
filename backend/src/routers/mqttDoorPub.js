// const express = require(`express`)
// const router = new express.Router()
// const mqtt = require(`mqtt`)
// const user = require(`../models/user`)
// const auth = require(`../middleware/auth`)
// const cookies = require(`../middleware/cookies`)
// const isACurrentGuest = require(`../utils/isACurrentGuest`)

// // In case turkish time changed, you set the new time from here
// // The current diff btw UTC and Turkish time is 3 Hours.
// let UTCTurkeyDiff = 3
// // Converting from UTC to Turkish Time.
// let UTCToTurkey = UTCTurkeyDiff*60*60*1000

// //const client = mqtt.connect('mqtt://f1972806fe83_broker')

// router.post(`/openDoorMqtt`, cookies ,auth ,async(req, res) => {
//     try{
//         if (isACurrentGuest(req.user, UTCToTurkey)){
//             if (req.user.lockStatus === 'unlock') {
//                 topic = `abooodch/${req.user.propertyName}/${req.user.roomNumber}`
//                 msg = `{"CMD": "unlock the door"}`
//                 console.log(topic)
//                 client.publish(topic, msg, qos=2)
//                 res.send(`Published successfully`)
//                 }
//                 else{
//                     console.log(`Not allowed, Please ask the receptionist to unlock your room`)
//                     throw new Error(`Not allowed, Please ask the receptionist to unlock your room`)
//                 }
//             } else{
//                 console.log(`Not Allowed, please ask the receptionist to extend your reservation`)
//                 throw new Error(`Not Allowed, please ask the receptionist to extend your reservation`)
//             }
//         } catch(e){

//             res.send(e)
//         }
// })

// module.exports = router