const BankTransfer = require('../models/bankTransfer'),
    Investment = require('../models/investment'),
    User = require('../models/user')
Portfolio = require('../models/portfolio')

exports.bankTransfer_create = (req, res) => {
    console.log(req.body.tambahSlot, 'ini tambahSlot req')
    BankTransfer.create({
        pemilikAkun: req.body.pemilikAkun,
        noRek: req.body.noRek,
        tambahSlot: req.body.tambahSlot,
        user : req.body.userId,
        investment: req.body.investmentId,
        jumlahTransfer : req.body.tambahSlot * req.body.hargaLot,
        slot : req.body.tambahSlot


    }).then(bankTransfer=>{
        res.status(200).json({
            message: 'bank transfers retrieved',
            success: true,
            data: bankTransfer
        })
    })
    // .catch(err=>{
    //     res.status(400).json({
    //         message: 'bank transfers retrieved',
    //         success: false,
    //         data: err
    //     })
    // })
}

exports.bankTransfer_allNotPaid = (req, res) => {
    BankTransfer.find({ isPaid: false }).populate('investment').populate('user').then(bankTransfers => {
        res.status(200).json({
            message: 'bank transfers retrieved',
            success: true,
            data: bankTransfers
        })
    })
}

exports.bankTransfer_show = (req, res) => {
    BankTransfer.findById(req.params.idBank).populate('user').populate('investment').exec((err, bankTransfer) => {
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
    BankTransfer.findById(req.params.idBank).populate('user').populate('investment').exec((err, bankTransfer) => {
        bankTransfer.isPaid = true
        bankTransfer.investment.popularity = bankTransfer.user.popularity + 1
        bankTransfer.save().then(savedTrf => {
            Portfolio.findOne({ investment: savedTrf.investment, user: savedTrf.user }).then((portfolio) => {
                console.log(portfolio)
                if (portfolio) {
                    portfolio.slot = portfolio.slot + savedTrf.slot
                    portfolio.save().then(savedPortfolio => {
                        res.status(200).json({
                            message: 'bank transfer retrieved',
                            success: true,
                            dataPortfolio: savedPortfolio,
                            dataTransfer: savedTrf
                        })
                    })
                } else {
                    Portfolio.create({
                        user: savedTrf.user,
                        investment: savedTrf.investment,
                        slot: savedTrf.slot
                    }).then(savedPortfolio => {
                        res.status(200).json({
                            message: 'bank transfer retrieved',
                            success: true,
                            dataPortfolio: savedPortfolio,
                            dataTransfer: savedTrf
                        })
                    })

                }
            })
        })
    })
}

exports.portfolio_findByUser = (req, res) => {
    Portfolio.find({ user: req.params.userId }).populate('investment').exec((err, portfolio) => {
        if (err) {
            res.status(400).json({
                message: "fail",
                success: false,
                data: err
            })
        } else {
            res.status(200).json({
                message: "success",
                success: true,
                data: portfolio
            })
        }
    })
}

exports.portfolio_findByInvestment = (req, res) => {
    Portfolio.find({ investment: req.params.investmentId }).populate('user').exec((err, investors) => {
        if (err) {
            res.status(400).json({
                message: "fail",
                success: false,
                data: err
            })
        } else {
            res.status(200).json({
                message: "success",
                success: true,
                data: investors
            })
        }
    })
}
