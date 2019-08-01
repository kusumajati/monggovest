module.exports = app =>{
    const   investment  = require('../controller/investment.controller'),
            auth        = require('../middleware/auth')   

    app.post('/v1/api/investment', auth.auth, investment.investment_create)
    app.get('/v1/api/investment/:id', investment.investment_show)
    app.get('/v1/api/allinvestments', investment.allinvestment)
    app.put('/v1/api/investment/:id', auth.auth, investment.investment_update)
    app.get('/v1/api/investment_terbaru', investment.investment_terbaru)
    app.get('/v1/api/investment/:id/verify', auth.auth, auth.admin_auth, investment.investment_verify)
    app.delete('/v1/api/investment/:id', auth.auth, auth.admin_auth, investment.investment_delete)
}
