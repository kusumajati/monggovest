const mongoose  = require('mongoose')

var bankTransferSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    pemilikAkun:{type:String, required:true, minlength:4},
    jumlah:{type:String, required:true},
    investment:{type:mongoose.Schema.Types.ObjectId, ref:'Investment'},
    isPaid:{type:Boolean, default:false}
})

module.exports = mongoose.model('BankTransfer', bankTransferSchema)