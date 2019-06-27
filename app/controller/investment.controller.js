const   Investment = require('../models/investment'),
        User       = require('../models/user')

exports.investment_create = (req, res)=>{

    User.findOne({_id:req.decoded._id}).then(user=>{
        user.noIdentitas=req.body.noIdentitas
        user.alamat= req.body.alamat
        user.jenisIdentitas=req.body.jenisIdentitas
        user.provinsi=req.body.provinsi
        user.telepon= req.body.telepon
        user.penghasilan=req.body.penghasilan
        user.incomeLow=req.body.incomeLow
        user.incomeHigh=req.body.incomeHigh
    user.save().then(()=>{
        const newInvestment = new Investment({
            nama:req.body.nama,
            nilaiInvestasi:req.body.nilaiInvestasi,
            jumlahSlot:req.body.jumlahSlot,
            gambar:req.body.gambar,
            returnLow:req.body.returnLow,
            returnHigh:req.body.returnHigh,
            periodeBagiHasil:req.body.periodeBagiHasil,
            rincian:req.body.rincian,
            ringkasan:req.body.ringkasan,
        })
        newInvestment.hargaLot = newInvestment.nilaiInvestasi/newInvestment.jumlahSlot
        newInvestment.author = user._id
        newInvestment.save().then(investment=>{
            res.status(200).json({
                message:`${investment.nama} is a new investment`,
                success:true,
                data:investment
            })
        }).catch(err=>{
            res.status(400).json({
                message:`fail to create new investment`,
                success:false,
                data:err  
            })
        })
    }).catch(err_user=>{
        res.status(400).json({
            message:'error',
            success:false,
            data:err_user
        })
    })
    }).catch(err=>{
        res.status(400).json({
            message:`fail to find user`,
            success:false,
            data:err  
        })
    })
}

exports.investment_show = (req,res)=>{
    Investment.findById(req.params.id).then(investment=>{
        res.status(400).json({
            message:`${investment.nama} is retrieved`,
            success:true,
            data:investment
        })
    }).catch(err=>{
        res.status(200).json({
            message:'fail to get investment',
            success:false,
            data:err
        })
    })
}