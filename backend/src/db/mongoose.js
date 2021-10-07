const mongoose  = require('mongoose')
//require('dotenv').config();

//mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
//For Docker
//
mongoose.connect(process.env.MONGODB_URL,{
    'useNewUrlParser': true,
    'useCreateIndex': true,
    'useUnifiedTopology': true
})

//mongoose.connect('mongodb://mongo:27017/task-manager-api' ,{
//    'useNewUrlParser': true,
//    'useCreateIndex': true,
//    'useUnifiedTopology': true
//})


module.exports = mongoose
