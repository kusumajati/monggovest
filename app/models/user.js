const mongoose  = require('mongoose')


var userSchema = new mongoose.Schema({
    namaLengkap: {type:String, minlength:4, required:true},
    password: {type:String, minlength:4, required:true},
    email: {type:String, required:true},
    investments:[{type: mongoose.Schema.Types.ObjectId, ref:'Investment'}],
    bankTransfers:[{type: mongoose.Schema.Types.ObjectId, ref:'BankTransfer'}],
    
    noIdentitas:{type:String},
    alamat: {type:String},
    jenisIdentitas:{type:String},
    provinsi:{type:String},
    telepon: {type:String},
    penghasilan:{type:String},
    incomeLow:{type:Number},
    incomeHigh:{type:Number},
        
    
})
const userModel = mongoose.model('User', userSchema)

module.exports = userModel