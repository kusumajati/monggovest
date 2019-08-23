module.exports = (app) =>{
    const   bankTransfer    = require('../controller/bankTransfer.controller'),
            auth            = require('../middleware/auth')
    app.post('/v1/api/bank_transfer/:idInvestment',  bankTransfer.bankTransfer_create)
    app.get('/v1/api/bank_transfer/:idBank', auth.auth, bankTransfer.bankTransfer_show)
    app.get('/v1/api/bank_transfer/:idBank/pay', auth.auth, bankTransfer.bankTransfer_pay)
    app.get('/v1/api/allNotPaid', auth.auth, auth.admin_auth, bankTransfer.bankTransfer_allNotPaid)
    app.get('/v1/api/portfolioUser/:userId', bankTransfer.portfolio_findByUser)
    app.get('/v1/api/portfolioInvestment/:investmentId', bankTransfer.portfolio_findByInvestment)
}