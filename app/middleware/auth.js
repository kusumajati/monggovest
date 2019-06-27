const jwt = require('jsonwebtoken')

exports.auth = (req,res,next)=>{
    var token = req.headers.authorization
    if(token){
        jwt.verify(token, 'secretKey', (err,decoded)=>{
            if(err){
                res.status(400).json({
                    success:false,
                    message: err
                }) 
            }else{
                req.decoded = decoded
                next()
            }
        })
    }else{
        res.status(400).json({
            success:false,
            message: "fail to login"
        })
    }
}