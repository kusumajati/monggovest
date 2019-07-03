const mongoose  = require('mongoose')


var investmentSchema = new mongoose.Schema({
    nama:{type:String,minlength:4,required:true},
    users:[{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    author:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    jumlahSlot:{type:Number,min:1,max:100},
    slot:{type:Number,default:0},
    nilaiInvestasi:{type:Number, min:[1000000,'Nilai investasi harus bernilai lebih dari Rp 1.000.000,-'] ,required:true},
    terInvest:{type:Number, default:0},
    gambar:[{type:String}],
    bankTransfers:[{type:mongoose.Schema.Types.ObjectId, ref:'BankTransfer'}],
    returnLow:{type:Number, required:true},
    returnHigh:{type:Number, required:true},
    periodeBagiHasil:{type:Number, required:true},
    rincian:{type:String},
    ringkasan:{type:String},
    hargaLot:{type:Number, default:0}
})

const investmentModel = mongoose.model('Investment', investmentSchema)

module.exports = investmentModel