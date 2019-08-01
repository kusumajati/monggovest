const mongoose  = require('mongoose')


var userSchema = new mongoose.Schema({
    namaLengkap: {type:String, minlength:4, required:true},
    password: {type:String, minlength:4, required:true},
    email: {type:String, required:true},
    portfolio:[{investment:{type: mongoose.Schema.Types.ObjectId, ref:'Investment'},slot:{type:Number}}],
    bankTransfers:[{type: mongoose.Schema.Types.ObjectId, ref:'BankTransfer'}],
    profilePicture:{type:String, default:'http://www.greatindonesia.org/wp-content/uploads/2016/01/profile-logo.png'},
    noIdentitas:{type:String, default:''},
    alamat: {type:String, default:''},
    jenisIdentitas:{type:String, default:''},
    provinsi:{type:String},
    telepon: {type:String, default:''},
    incomeLow:{type:Number},
    incomeHigh:{type:Number},
    sumberPenghasilan:{type:String, default:'Gaji'},
    jumlahPenghasilan:{type:String, default:'< Rp 4,000,000'},
    isAdmin:{type:Boolean, default:false},
    lastLogin:{type:Date},
    tanggalLahir:{type:Date, default:null},
    authoredInvestments:[{type:mongoose.Schema.Types.ObjectId, ref:'Investment'}]
    // createdInvestment:[{type: mongoose.Schema.Types.ObjectId, ref:'Investment'}]   
},
{ timestamps: { createdAt: 'created_at' } })
const userModel = mongoose.model('User', userSchema)

module.exports = userModel