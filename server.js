require('dotenv').config()
const   express     = require('express'),
        app         = express(),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        port        = process.env.PORT || 5000,
        dbConfig    = require('./config/db'),
        cors        = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())



// app.use(function(req, res, next){
//     res.header("Access-Control-Allow-Origin","*")
//     res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization")
// })
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI||dbConfig.mlab, {useNewUrlParser:true}).then(()=>{
    console.log('you are connected to the database')
},(err)=>{
    console.log('you have failed to connect to the database', err)
    process.exit()
})


app.get('/',(req,res)=>{
    res.send('monggovest homepage')
})
//required API
require('./app/routes/user.routes')(app)
require('./app/routes/investment.routes')(app)
require('./app/routes/bankTransfer.routes')(app)

app.listen(port, ()=>{
    console.log(`you have started the server, listening on port ${port}`)
})
