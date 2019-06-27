const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    User = require('../models/user')

exports.create_user = (req, res) => {
    var newUser = new User({
        namaLengkap: req.body.namaLengkap,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        noIdentitas:'',
        alamat: '',
        jenisIdentitas:'',
        provinsi:'',
        telepon: '',
        penghasilan:'',
        incomeLow:0,
        incomeHigh:0
    })
    newUser.save().then(result => {
        res.status(200).json({
            success: true,
            message: `${result.namaLengkap} is a new user`,
            data: result
        })        
    }).catch(err => {
            res.status(400).json({
                success: false,
                message: "fail to create user",
                data: err
            })
        })
}

exports.user_login = (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        bcrypt.compare(req.body.password, user.password).then(response => {
            if (response) {
                var token = jwt.sign(user.toJSON(), "secretKey", {
                    algorithm: 'HS256'
                })
                res.status(201).json({
                    message: 'You are logged in!',
                    success: true,
                    token: token
                })
            } else {
                res.status(400).json({
                    message: 'You are failed to log in',
                    success: false,
                    token: response
                })
            }
        }).catch(err_compare => {
            res.status(400).json({
                message:'wrong  password',
                success: false,
                data: err_compare
            })
        })
    }).catch(err_finOne => {
        res.status(400).json({
            success: false,
            message: err_finOne
        })
    })
}

exports.user_show = (req, res) => {
    User.findOne({ _id: req.decoded._id }, (err,user)=>{
        if(err){
            res.status(400).json({
                message:'error',
                success:false,
                data:err
            })
        }else{
            res.status(400).json({
                message:'user retrieved',
                success:true,
                data:user
            })
        }
    })
}

// exports.alluser = (req, res) =>{
//     User.find({}).then(data=>{
//         res.status(200).json({
//             message:'all',
//             success:true,
//             data:data
//         })
//     }).catch(err=>{
//         res.status(400).json({
//             message:'fail',
//             success:false,
//             data:err
//         })
//     })
// }