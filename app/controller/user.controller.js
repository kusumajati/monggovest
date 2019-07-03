require('dotenv').config()
const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    User = require('../models/user')

exports.create_user = (req, res) => {
    User.findOne({ email: req.body.email }, (search_err, foundUser) => {
        if (search_err) {
            res.status(400).json({
                message:`error`,
                success:false,
                data:search_err
            })
        } else if(foundUser) {
            res.status(200).json({
                message:`email ${foundUser.email}has already existed`,
                success:false
            })
        }else{
            User.create({
                namaLengkap: req.body.namaLengkap,
                password: bcrypt.hashSync(req.body.password, 10),
                email: req.body.email,
                noIdentitas: '',
                alamat: '',
                jenisIdentitas: '',
                provinsi: '',
                telepon: '',
                penghasilan: '',
                incomeLow: 0,
                incomeHigh: 0
            }, (create_err, user) => {
                if (create_err) {
                    res.status(400).json({
                        message: 'fail to create user',
                        success: false,
                        data: create_err
                    })
                } else {
                    user.save((save_err, newUser) => {
                        if (save_err) {
                            res.status(400).json({
                                message: 'fail to create user',
                                success: false,
                                data: save_err
                            })
                        } else {
                            res.status(200).json({
                                message: 'new user created',
                                success: true,
                                data: newUser
                            })
                        }
                    })
                }
            })
        }
    })
}

exports.user_login = (req, res) => {
    User.findOne({email:req.body.email},(err,user)=>{
        if(user){
            bcrypt.compare(req.body.password,user.password,(err,response)=>{
                if(err){
                    res.status(400).json({
                        message:'something went wrong',
                        success:false,
                        data:err
                    })
                }else if(response){
                    const token = jwt.sign(user.toJSON(),process.env.JWT_KEY,{algorithm: 'HS256'})
                    res.status(200).json({
                        message:'you are logged in',
                        success:true,
                        token:token
                    })
                }else{
                    res.status(400).json({
                        message:'wrong password',
                        success:false
                    })
                }
            })
            
        }else{
            res.status(400).json({
                message: 'fail to find user',
                success: false,
                data: err
            })
        }
    })
}

exports.user_show = (req, res) => {
    User.findOne({ _id: req.decoded._id }, (err, user) => {
        if (err) {
            res.status(400).json({
                message: 'error',
                success: false,
                data: err
            })
        } else {
            res.status(200).json({
                message: 'user retrieved',
                success: true,
                data: user
            })
        }
    })
}

exports.alluser = (req, res) => {
    User.find({}).then(data => {
        res.status(200).json({
            message: 'all',
            success: true,
            data: data
        })
    }).catch(err => {
        res.status(400).json({
            message: 'fail',
            success: false,
            data: err
        })
    })
}