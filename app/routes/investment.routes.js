module.exports = app =>{
    const   investment  = require('../controller/investment.controller'),
            auth        = require('../middleware/auth')   

    app.post('/v1/api/investment', auth.auth, investment.investment_create)
    app.get('/v1/api/investment/:id', investment.investment_show)
    app.get('/allinvestment', investment.allinvestment)
    app.put('/v1/api/investment/:id', auth.auth, investment.investment_update)
}