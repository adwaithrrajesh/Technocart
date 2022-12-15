const session = require('express-session');
const user_model = require('../model/User_model')
const path = require('path')
const multer = require('multer')




module.exports = {
    admin_auth: (req,res,next)=>{
        if(req.session.adminLoggedin){
            next()
        }else{
            res.redirect('/admin')
        }
    },

    user_auth:async(req,res,next)=>{
        let user = req.session.user 
        let login = req.session.loggedIn
        if(login){
            let user_block = await user_model.findOne({block:user.block})
            if(user_block.block == true){
                req.session.loggedIn = false
                res.render('users/login')
                console.log('User blocked Auth')
            }else{
                next()
            }
        }else{
            next()
        }
       
    }
}