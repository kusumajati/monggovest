module.exports = (app) =>{
    const   bankTransfer    = require('../controller/bankTransfer.controller'),
            auth            = require('../middleware/auth')
    app.post('/v1/api/bank_transfer/:id', auth.auth, bankTransfer.bankTransfer_create)
    app.get('/v1/api/bank_transfer/:id', auth.auth, bankTransfer.bankTransfer_show)
    app.get('/v1/api/bank_transfer/:id/paid', bankTransfer.bankTransfer_pay)
}