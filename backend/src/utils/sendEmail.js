const nodeMailer = require('nodemailer')

var transporter = nodeMailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmail = (to, pass) => {
    const emailOption = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: process.env.EMAIL_SUBJECT,
    text: `Greeting from Modern Hotel \n
           open door credentials are: \n
           email: ${ to } \n
           password: ${ pass }`
    }

    transporter.sendMail(emailOption, function(error, info) {
        if (error){
            console.log(error)
        }else{
            console.log(`sent successfully ${info.response}`)
        }
    })
}

module.exports = sendEmail
