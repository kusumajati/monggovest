require('dotenv').config()
const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    User = require('../models/user')

exports.create_user = (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            res.status(200).json({
                message: `email ${user.email}has already existed`,
                success: false
            })
        } else {
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
            }).then(newUser=>{
                newUser.save().then(savedUser=>{
                    res.status(200).json({
                        message:'new user created',
                        success:true,
                        data: savedUser
                    })
                }).catch(saveErr=>{
                    res.status(400).json({
                        message:'fail to save new user',
                        success:false,
                        data:saveErr
                    })
                })
            }).catch(newErr=>{
                res.status(400).json({
                    message:'fail to create new user',
                    success:false,
                    data:newErr
                })
            })
        }

    }).catch(err => {
        res.status(400).json({
            message:'fail to search user',
            success:false,
            data:err
        })
    })
}

exports.user_login = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, response) => {
                if (err) {
                    res.status(400).json({
                        message: 'something went wrong',
                        success: false,
                        data: err
                    })
                } else if (response) {
                    const createToken = {
                        id: user.id,
                        email: user.email,
                        password: user.password
                    }
               
                    const token = jwt.sign(JSON.stringify(createToken), process.env.JWT_KEY, { algorithm: 'HS256' })
                    res.status(200).json({
                        message: `you are logged in as ${user.namaLengkap}`,
                        success: true,
                        token: token
                    })
                } else {
                    res.status(400).json({
                        message: 'wrong password',
                        success: false
                    })
                }
            })

        } else {
            res.status(400).json({
                message: 'fail to find user',
                success: false,
                data: err
            })
        }
    })
}

exports.user_show = (req, res) => {
    User.findOne({ _id: req.decoded.id }, (err, user) => {
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

exports.user_update = (req, res)=>{
    User.findByIdAndUpdate(req.decoded.id, {$set:{
        namaLengkap: req.body.namaLengkap,
                noIdentitas: req.body.noIdentitas,
                alamat: req.body.alamat,
                jenisIdentitas: req.body.jenisIdentitas,
                provinsi: req.body.provinsi,
                telepon: req.body.telepon,
                incomeLow: req.body.incomeLow,
                incomeHigh: req.body.incomeHigh,
    }}).then(updatedUser=>{
        res.status(200).json({
            message:"user updated",
            success: true,
            data: updatedUser
        })
    }).catch(err=>{
        res.status(400).json({
            message:'fail to find and update',
            success:false,
            data:err
        })
    })
}
