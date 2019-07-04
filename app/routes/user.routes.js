module.exports = (app)=>{
    const user = require('../controller/user.controller')
    const auth = require('../middleware/auth')

    app.post('/v1/api/user', user.create_user)
    app.post('/v1/api/user/login',  user.user_login)
    app.get('/v1/api/user', auth.auth, user.user_show)
    app.get('/alluser', user.alluser)
    app.put('/v1/api/user', auth.auth, user.user_update)


}