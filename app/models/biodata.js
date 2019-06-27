const mongoose  = require('mongoose')

var biodataSchema = new mongoose.Schema({
    noIdentitas:{type:String},
    alamat: {type:String},
    jenisIdentitas:{type:String},
    provinsi:{type:String},
    telepon: {type:String},
    penghasilan:{type:String},
    incomeLow:{type:Number},
    incomeHigh:{type:Number}
})

module.exports = mongoose.model('Biodata', biodataSchema)
