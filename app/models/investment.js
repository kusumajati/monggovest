const mongoose  = require('mongoose')


var investmentSchema = new mongoose.Schema({
    nama:{type:String,minlength:4,required:true},
    users:[{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    author:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    jumlahSlot:{type:Number,min:1,max:100},
    slot:{type:Number,default:0},
    userSlot:{type:Number,default:0},
    nilaiInvestasi:{type:Number, min:[1000000,'Nilai investasi harus bernilai lebih dari Rp 1.000.000,-'] ,required:true},
    terInvest:{type:Number, default:0},
    gambar:[{type:String, required:true}],
    bankTransfers:[{type:mongoose.Schema.Types.ObjectId, ref:'BankTransfer'}],
    returnLow:{type:Number, required:true},
    returnHigh:{type:Number, required:true},
    periodeBagiHasil:{type:Number, default:1, min:1},
    rincian:{type:String},
    ringkasan:{type:String},
    hargaLot:{type:Number, default:0},
    popularity:{type:Number, default:0},
    isVerified:{type:Boolean, default:false},
    risiko:{type:String, default:'Sedang'},
    periodeKontrak:{type:Number, default:1, min:1},
    alamat:{
        provinsi:{type:String},
        kabupaten:{type:String},
        desa:{type:String},
        alamat:{type:String}
    }
},
{ timestamps: { createdAt: 'created_at' } })

const investmentModel = mongoose.model('Investment', investmentSchema)

module.exports = investmentModel