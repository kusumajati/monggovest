const Investment = require('../models/investment'),
    User = require('../models/user')

exports.investment_create = (req, res) => {
    User.findOne({ _id: req.decoded._id }, (err, user) => {
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
    Investment.findById(req.params.id).then(investment => {
        res.status(400).json({
            message: `${investment.nama} is retrieved`,
            success: true,
            data: investment
        })
    }).catch(err => {
        res.status(200).json({
            message: 'fail to get investment',
            success: false,
            data: err
        })
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