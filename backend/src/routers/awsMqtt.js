// const express = require(`express`)
// const router = new express.Router()
// const awsIoT = require(`aws-iot-device-sdk`)
// const user = require(`../models/user`)
// const auth = require(`../middleware/auth`)
// const cookies = require(`../middleware/cookies`)
// const  isACurrentGuest = require(`../utils/isACurrentGuest`)


// let UTCTurkeyDiff = 3
// // Converting from UTC to Turkish Time.
// let UTCToTurkey = UTCTurkeyDiff*60*60*1000

// // TODO
// const endpointFile = require(`/home/cisco/environment/endpoint.json`);

// const deviceName = `Nodejs-server`

// const device = awsIoT.device({
//     keyPath: `/home/cisco/environment/0371d80974-private.pem.key`,
//     certPath: `/home/cisco/environment/0371d80974-certificate.pem.crt`,
//     caPath: `/home/cisco/environment/root-CA.crt`,
//     clientId: deviceName,
//      host: endpointFile.endpointAddress
// });

// //device.on('connect', () =>{
// //    console.log('Connected to AWS IoT');
// //
// //    // Start the publish loop
// //    infiniteLoopPublish();
// //});

// device.on(`connect`, () => {
//     console.log(`connected to AWS IoT`)
// });

// router.post(`/openDoor`, cookies, auth, async(req, res) => {
//     try{
//         console.log(req.user)
//         if (isACurrentGuest(req.user, UTCToTurkey)){
//             if (req.user.lockStatus === `unlock`){
//                 topic = `abooodch/${req.user.propertyName}/${req.user.roomNumber}`
//                 //topic = `abooodch/${req.user.hotelName}/hi`
//                 msg = `{"CMD": "unlock the door"}`
//                 console.log(topic)
//                 device.publish(topic, msg, qos=2)
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