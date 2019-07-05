const mongoose = require('mongoose')
const popularInvestmentSchema = new mongoose.Schema({
    investments:[{type:mongoose.Schema.Types.ObjectId, ref:'Investment'}]
})
const PopularInvestment = mongoose.model('PopularInvestment', popularInvestmentSchema)

module.exports = PopularInvestment
