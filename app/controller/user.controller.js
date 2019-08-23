require('dotenv').config()
const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    User = require('../models/user'),
    nodemailer = require('nodemailer')

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nino.bmakj@gmail.com',
            pass: process.env.GMAIL_PASSWORD
        }
    });
    let info = {
        from: 'nino.bmakj@gmail.com', // sender address
        to: 'nino.bmakj@gmail.com', // list of receivers
        subject: 'Hello from node app', // Subject line
        text: 'Hello world?', // plain text body
    };
    // transporter.sendMail(info, (err, sentMail)=>{
    //     if(err){
    //         console.log(err)
    //     }else{
    //         console.log('Email sent: '+sentMail.response)
    //     }
    // })

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

            }).then(newUser => {
                // if (newUser.email.includes('@admin')) {
                //     newUser.isAdmin = true
                // }
                const createToken = {
                    id: newUser.id,
                    email: newUser.email,
                    password: newUser.password,
                    isAdmin: newUser.isAdmin
                }
                const token = jwt.sign(JSON.stringify(createToken), process.env.JWT_KEY, { algorithm: 'HS256' })
            
                res.status(200).json({
                    message: 'new user created',
                    success: true,
                    data: savedUser,
                    token: token
                })

            }).catch(newErr => {
                res.status(400).json({
                    message: 'fail to create new user',
                    success: false,
                    data: newErr
                })
            })
        }

    }).catch(err => {
        res.status(400).json({
            message: 'fail to search user',
            success: false,
            data: err
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
                        password: user.password,
                        isAdmin: user.isAdmin
                    }
                    const token = jwt.sign(JSON.stringify(createToken), process.env.JWT_KEY, { algorithm: 'HS256' })
                    user.lastLogin = new Date().toISOString()
                    user.save((errSav, savedUser) => {
                        if (errSav) {
                            res.status(400).json({
                                message: 'fail to save',
                                success: false,
                                data: errSav
                            })
                        } else {
                            res.status(200).json({
                                message: `you are logged in as ${user.namaLengkap}`,
                                success: true,
                                token: token,
                                data: savedUser
                            })
                        }

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
    User.findById(req.params.id).populate('authoredInvestments').populate({ path: 'bankTransfers', populate: { path: 'investment' } }).populate('portfolio').then(user => {
        res.status(200).json({
            message: 'user retrieved',
            success: true,
            data: user
        })
    }).catch(err => {
        res.status(400).json({
            message: 'error',
            success: false,
            data: err
        })
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

exports.user_update = (req, res) => {
    let params = {};
    for (let prop in req.body) if (req.body[prop]) params[prop] = req.body[prop];

    User.findByIdAndUpdate(req.decoded.id, params).then(user => {


       
        // if (req.body.tanggalLahir) { user.tanggalLahir = req.body.tanggalLahir }
        // if (req.body.namaLengkap) { user.namaLengkap = req.body.namaLengkap }
        // if (req.body.jenisIdentitas) { user.jenisIdentitas = req.body.jenisIdentitas }
        // if (req.body.noIdentitas) { user.noIdentitas = req.body.noIdentitas }
        // if (req.body.alamat) { user.alamat = req.body.alamat }
        // if (req.body.telepon) { user.telepon = req.body.telepon }
        // if (req.body.jumlahPenghasilan) { user.jumlahPenghasilan = req.body.jumlahPenghasilan }
        // if (req.body.sumberPenghasilan) { user.sumberPenghasilan = req.body.sumberPenghasilan }
        // if (req.body.profilePicture) { user.profilePicture = req.body.profilePicture }
        // if (req.body.invId) {
        //     user.authoredInvestments.push(req.body.invId)
        // }
        // if (req.body.bankTransferId) {
        //     user.bankTransfers.push(req.body.bankTransferId)
        // }
        // user.save().then(updatedUser => {
            res.status(200).json({
                message: "user updated",
                success: true,
                data: user
            })
        // })
        // .catch(error => {
        //     res.status(400).json({
        //         message: 'fail to save update',
        //         success: false,
        //         data: error
        //     })

        // })

    }).catch(err1 => {
        res.status(400).json({
            message: 'fail to find and update',
            success: false,
            data: err1
        })
    })

}
