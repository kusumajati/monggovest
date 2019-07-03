const mongoose  = require('mongoose')


var bankTransferSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    pemilikAkun:{type:String, required:true, minlength:4},
    noRek: {type:String, required:true, minlength:6},
    jumlahTransfer:{type:Number},
    investment:{type:mongoose.Schema.Types.ObjectId, ref:'Investment'},
    isPaid:{type:Boolean, default:false}
})
const bankTransferModel = mongoose.model('BankTransfer', bankTransferSchema)

module.exports = bankTransferModel