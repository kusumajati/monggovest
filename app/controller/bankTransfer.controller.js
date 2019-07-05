const BankTransfer = require('../models/bankTransfer'),
    Investment = require('../models/investment'),
    User = require('../models/user'),
    PopularInvestment = require('../models/popularInvestment')

exports.bankTransfer_create = (req, res) => {
    Investment.findById(req.params.id).then(investment => {
        User.findById(req.decoded._id).then(user => {
            //update user biodata
            user.noIdentitas = req.body.noIdentitas
            user.alamat = req.body.alamat
            user.jenisIdentitas = req.body.jenisIdentitas
            user.provinsi = req.body.provinsi
            user.telepon = req.body.telepon
            user.penghasilan = req.body.penghasilan
            user.incomeLow = req.body.incomeLow
            user.incomeHigh = req.body.incomeHigh
            //check slot tersedia
            var slotHitung = investment.slot + req.body.tambahSlot
            if (slotHitung < investment.jumlahSlot) {
                BankTransfer.create({
                    pemilikAkun: req.body.pemilikAkun,
                    noRek: req.body.noRek,
                }).then(bankTransfer => {
                    bankTransfer.jumlahTransfer = req.body.tambahSlot * investment.hargaLot
                    bankTransfer.user = user
                    bankTransfer.investment = investment
                    bankTransfer.save().then(newTransfer => {
                        user.bankTransfers.push(newTransfer)
                        user.save().then(() => {
                            res.status(200).json({
                                message: 'new bank transfer is created',
                                success: true,
                                data: newTransfer
                            })
                        }).catch(err => {
                            res.status(400).json({
                                message: 'fail to create new bank transfer',
                                success: false,
                                data: err
                            })
                        })
                    }).catch(err_trf => {
                        res.status(400).json({
                            message: 'fail to create bank transfer',
                            success: false,
                            data: err_trf
                        })
                    })
                }).catch(err_bank => {
                    res.status(400).json({
                        message: 'fail to create bank transfer',
                        success: false,
                        data: err_bank
                    })
                })
            } else {
                res.status(400).json({
                    message: 'slot tersedia sudah habis',
                    success: false,
                    data: investment.slot
                })
            }
        }).catch(err_user => {
            res.status(400).json({
                message: 'user error',
                success: false,
                data: err_user
            })
        })
    }).catch(err_inv => {
        res.status(400).json({
            message: 'investment unavailable',
            success: false,
            data: err_inv
        })
    })
}

exports.bankTransfer_show = (req, res) => {
    BankTransfer.findById(req.params.id).populate('user').exec((err, bankTransfer) => {
        if (bankTransfer) {
            res.status(200).json({
                message: 'bank transfer retrieved',
                success: true,
                data: bankTransfer
            })
        } else {
            res.status(400).json({
                message: 'bank transfer unavailable',
                success: false,
                data: err
            })
        }
    })
}

exports.bankTransfer_pay = (req, res) => {
    BankTransfer.findById(req.params.id).populate('investment').exec((bankTransfer) => {
        bankTransfer.isPaid = true
        bankTransfer.investment.popularity = bankTransfer.user.popularity + 1
        bankTransfer.save().then(savedTrf=>{
            res.status(400).json({
                message: 'transfer verified',
                success: true,
                data: savedTrf
            })
        }).catch(errSav=>{
            res.status(400).json({
                message: 'fail to verify transfer',
                success: false,
                data: errSav
            })
        }).then(()=>{
            Investment.find({}).limit(3).sort('-popularity').exec((errInv, popularInvestment)=>{
                if(errInv){
                    console.log('fail to find top investment')
                }else{
                    console.log(popularInvestment)
                }
            })
        })

    })
}