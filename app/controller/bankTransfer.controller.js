const BankTransfer = require('../models/bankTransfer'),
    Investment = require('../models/investment'),
    User = require('../models/user')
Portfolio = require('../models/portfolio')

exports.bankTransfer_create = (req, res) => {
    Investment.findById(req.params.idInvestment).then(investment => {
        User.findById(req.decoded.id).then(user => {
            // console.log(user, 'ini user')
            if (investment.slot > 0) {
                BankTransfer.create({
                    pemilikAkun: req.body.pemilikAkun,
                    noRek: req.body.noRek,
                    namaBank: req.body.namaBank
                }).then(bankTransfer => {
                    bankTransfer.jumlahTransfer = req.body.tambahSlot * investment.hargaLot
                    bankTransfer.user = user
                    bankTransfer.investment = investment
                    bankTransfer.slot = req.body.tambahSlot

                    bankTransfer.save().then(newTransfer => {
                        user.bankTransfers.push(newTransfer)
                        user.save().then(userSav => {
                            investment.bankTransfers.push(newTransfer)
                            investment.slot = investment.slot - newTransfer.slot
                            investment.save().then(invSav => {
                                res.status(200).json({
                                    message: 'bank transfer created',
                                    success: true,
                                    dataBankTrfansfer: newTransfer,
                                    dataInv: invSav,
                                    dataUser: userSav
                                })
                            })
                        })
                    })
                })

            } else {
                res.status(400).json({
                    message: 'slot sudah habis',
                    success: false,
                    data: investment.slot
                })
            }
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: 'slot sudah habis',
            success: false,
            data: investment.slot
        })
    })
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
            console.log(savedTrf.investment, savedTrf.user)
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
