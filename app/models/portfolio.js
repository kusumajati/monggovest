const mongoose  = require('mongoose')


var portfolioSchema = new mongoose.Schema({
user:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
investment:{type: mongoose.Schema.Types.ObjectId, ref:'Investment'},
slot:{type:Number, default:0}
},
{ timestamps: { createdAt: 'created_at' } })
const portfolioModel = mongoose.model('Portfolio', portfolioSchema)

module.exports = portfolioModel