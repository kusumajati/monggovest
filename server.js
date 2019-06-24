require('dotenv').config()
const   express     = require('express'),
        app         = express(),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        swaggerUi = require('swagger-ui-express'),
        swaggerDoc = require("./swagger.json"),
        port        = process.env.PORT || 5000,
        dbConfig    = require('./config/db')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI||dbConfig.mlab, {useNewUrlParser:true}).then(()=>{
    console.log('you are connected to the database')
},(err)=>{
    console.log('you have failed to connect to the database', err)
    process.exit()
})

app.use("/api/docs", swaggerUi.serve)
app.get("/api/docs",swaggerUi.setup(swaggerDoc))

app.get('/',(req,res)=>{
    res.send('monggovest homepage')
})

app.listen(port, ()=>{
    console.log(`you have started the server, listening on port ${port}`)
})
