const mongoose  = require('mongoose')


var userSchema = new mongoose.Schema({
    namaLengkap: {type:String, minlength:4, required:true},
    password: {type:String, minlength:4, required:true},
    email: {type:String, required:true},
    investments:[{type: mongoose.Schema.Types.ObjectId, ref:'Investment'}],
    bankTransfers:[{type: mongoose.Schema.Types.ObjectId, ref:'BankTransfer'}],
    profilePicture:{type:String, default:'http://www.greatindonesia.org/wp-content/uploads/2016/01/profile-logo.png'},
    noIdentitas:{type:String},
    alamat: {type:String},
    jenisIdentitas:{type:String},
    provinsi:{type:String},
    telepon: {type:String},
    incomeLow:{type:Number},
    incomeHigh:{type:Number},
    isAdmin:{type:Boolean, default:false}   
},
{ timestamps: { createdAt: 'created_at' } })
const userModel = mongoose.model('User', userSchema)

module.exports = userModel