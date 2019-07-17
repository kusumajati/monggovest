const Investment = require('../models/investment'),
    User = require('../models/user')

exports.investment_create = (req, res) => {
    User.findOne({ _id: req.decoded.id }, (err, user) => {
        if (user) {
            Investment.create({
                nama: req.body.nama,
                nilaiInvestasi: req.body.nilaiInvestasi,
                jumlahSlot: req.body.jumlahSlot,
                gambar: req.body.gambar,
                returnLow: req.body.returnLow,
                returnHigh: req.body.returnHigh,
                periodeBagiHasil: req.body.periodeBagiHasil,
                rincian: req.body.rincian,
                ringkasan: req.body.ringkasan
            }, (err, newInvestment) => {
                if (newInvestment) {
                    newInvestment.hargaLot = newInvestment.nilaiInvestasi / newInvestment.jumlahSlot
                    newInvestment.author = user
                    newInvestment.save((err, savedInvestment) => {
                        if (savedInvestment) {
                            res.status(200).json({
                                message: `${savedInvestment.nama} is a new investment`,
                                success: true,
                                data: savedInvestment
                            })
                        } else {
                            res.status(400).json({
                                message: 'fail to create investment',
                                success: false,
                                data: err
                            })
                        }
                    })
                } else {
                    res.status(400).json({
                        message: 'fail to create investment',
                        success: false,
                        data: err
                    })
                }
            })
        } else {
            res.status(400).json({
                message: 'fail to get user',
                success: false,
                data: err
            })
        }
    })
}

exports.investment_show = (req, res) => {
    Investment.findById(req.params.id).exec((err,investment) => {

        if(err){
            res.status(400).json({
                message: 'fail to get investment',
                success: false,
                data: err
            })
        }else{
            res.status(200).json({
                message: `investment is retrieved`,
                success: true,
                data: investment
            })
            
        }
    })
}

exports.allinvestment = (req, res) => {
    Investment.find({}).then(result => {
        res.status(200).json({
            message: 'all investment',
            success: true,
            data: result
        })
    })
}

exports.investment_update = (req, res) => {
    User.findById(req.decoded.id).then(user=>{
        Investment.findById(req.params.id).exec((invErr, investment)=>{
            if(invErr){
                res.status(400).json({
                    message: 'fail to find user',
                    success:false,
                    data:invErr
                })
            }else{
                if(investment.author._id.$oid === user._id.$oid){
                investment.nama= req.body.nama
                investment.gambar= req.body.gambar
                investment.returnLow= req.body.returnLow
                investment.returnHigh= req.body.returnHigh
                investment.periodeBagiHasil= req.body.periodeBagiHasil
                investment.rincian= req.body.rincian
                investment.ringkasan= req.body.ringkasan      
                investment.save().then(invSav=>{
                    res.status(200).json({
                        message:'updated',
                        success:true,
                        data:invSav
                    })
                }).catch(savErr=>{
                    res.status(400).json({
                        message:'fail to save update',
                        success:false,
                        data:savErr
                    })
                })  
                }else{
                    console.log(typeof investment.author._id)
                    console.log(typeof user._id)
                    res.status(200).json({
                        message: 'investment fail to be updated',
                        success:false,
                        data: investment
                    })
                }
            }
        })
    }).catch(userErr=>{
        res.status(400).json({
            message:'fail to find user',
            success:false,
            data:userErr
        })
    })
}

exports.investment_delete = (req,res)=>{
    Investment.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.status(400).json({
                message:'fail to remove',
                success:false,
                data:err
            })
        }
    })
}
exports.investment_terbaru = (req,res)=>{
    Investment.find({}).limit(3).sort({date:-1}).exec((err,investmentsTerbaru)=>{
        if(err){
            res.status(400).json({
                message:'fail to sort investments',
                success:false,
                data:err
            })
        }else{
            res.status(200).json({
                message: 'investments terbaru retrieved',
                success:false,
                data: investmentsTerbaru
            })
        }
    })
}

