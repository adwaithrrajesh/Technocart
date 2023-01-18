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
    BlockAuth:async(req,res,next)=>{
        let login = req.session.loggedIn
        if(login){
            let user = req.session.user._id
            let check = await user_model.findOne({_id:user})
            if(check.block){
                req.session.destroy()
                res.redirect('/login')
            }else{
                next()
            }
        }else{
            next()
        }
    },
    UserAuth:async(req,res,next)=>{
        let login = req.session.loggedIn
        if(login){
            next()
        }else{
            res.redirect('/login')
        }
    }
}