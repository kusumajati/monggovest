const BankTransfer = require('../models/bankTransfer'),
    Investment = require('../models/investment'),
    User = require('../models/user')

exports.bankTransfer_create = (req, res) => {
    Investment.findById(req.params.id).populate('investment').exec((errInv,investment) => {
        if(errInv){
            res.status(400).json({
                message: 'investment unavailable',
                success: false,
                data: err_inv
            })
        }else{    
        //check slot tersedia
            User.findById(req.decoded.id).then(user=>{
                var slotHitung = investment.slot + req.body.tambahSlot
                if (slotHitung < investment.jumlahSlot) {
                    BankTransfer.create({
                        pemilikAkun: req.body.pemilikAkun,
                        noRek: req.body.noRek,
                    }).then(bankTransfer => {
                        bankTransfer.jumlahTransfer = req.body.tambahSlot * investment.hargaLot
                        bankTransfer.user = user
                        bankTransfer.investment = investment
                        bankTransfer.investment.users.push(investment)
                        bankTransfer.save().then(newTransfer => {
                            user.bankTransfers.push(newTransfer)
                            user.save().then((userSav) => {
                                console.log(newTransfer)
                                res.status(200).json({
                                    message: 'new bank transfer is created',
                                    success: true,
                                    data: userSav
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
                        message: 'slot sudah habis',
                        success: false,
                        data: investment.slot
                    })
                }
            }).catch(errUser=>{
                res.status(400).json({
                    message: 'user unavailable',
                    success: false,
                    data: errUser
                })
            })
        }
    })
}

exports.bankTransfer_show = (req, res) => {
    BankTransfer.findById(req.params.id).populate('user').populate('investment').exec((err, bankTransfer) => {
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
    BankTransfer.findById(req.params.id).populate('investment').populate('user').exec((bankTransfer) => {
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
        })
    })
}
