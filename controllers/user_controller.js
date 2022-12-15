const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const userHelper = require('../helpers/user_helpers');
const user_model = require('../model/User_model')
const auth = require('../middleware/auth')
const user_auth = auth.user_auth
const otp = require('../helpers/otp');
const { Sms, verify } = require('../helpers/otp');
const { countDocuments } = require('../model/User_model');
const ProductHelper = require('../helpers/product_helpers');
const { product_view } = require('../helpers/product_helpers');
const Category_model = require('../model/Category_model')
const product_model = require('../model/product_model');
const { Category } = require('./product_controller');
const ObjectId = require('objectid');
const cart_model = require('../model/cart_model')




module.exports = {

  // Signup
  signup:(req,res)=>{
      res.render('users/signup')
    },
  //register(post)
  register:(req,res)=>{
        req.session.phoneNumber = req.body.PhoneNumber
        let phone = req.session.phoneNumber
        req.session.user = req.body

        userHelper.doSignup(req.body).then((status)=>{
          if(status){
            Sms(phone) //otp
            res.redirect('/otp')
          }else{
            res.redirect('/register')
            console.log("User Exist")
          }
        })
        },
    //Login
  login:(req,res)=>{
      if(req.session.loggedIn){
        res.redirect('/')
      }else{
        res.render('users/login')
      }
    },

  //Login post
  login_post:(req,res)=>{
      userHelper.doLogin(req.body).then((response)=>{
          if(response.status == true){
            req.session.loggedIn = true;
            req.session.user = response.user;
              res.redirect('/')
          }
        else{
          res.redirect('/login')
        }
      })
    },
  // Logout
    logout:(req,res)=>{
      req.session.destroy();
      res.redirect('/')
    },
  // Home
  home: (req,res)=>{
      let login = req.session.loggedIn
      let user = req.session.user
      if(login){
          res.render('users/home',{user})
      }else{
        res.render('users/home',{user:false})
      }
    },

    // Shop
    shop: (req,res)=>{
      let user = req.session.user
      let page = req.query.page
      userHelper.product_view(page).then(async ({products_view,pagination_count})=>{
        let Categories = await Category_model.find()
      res.render('users/shop',{user,products_view,Categories,pagination_count})
      })
    }, 

    // Otp
    otp:(req,res)=>{
      res.render('users/otp')
    },

    // Otp Check
    otpCheck:(req,res)=>{
      let code_body = req.body
      let phone = req.session.phoneNumber
      let user = req.session.user
      verify(phone,code_body).then((status)=>{
        if(status){
          userHelper.dataInsert(user).then((status)=>{
            if(status){
              req.session.loggedIn = true
              res.redirect('/')
              console.log("user redirect")
            }else{
              console.log("An error found")
            }
          })
        }else{
          console.log("No work")
        }
      })
    },
    // Forgot password
    forgot_password:(req,res)=>{
      res.render('users/ForgotPassword/Enter_number')
    },
    // Give phone number input
    phonenumber:(req,res)=>{
      req.session.Phone_Number = req.body.PhoneNumber 
      let phone_num  = req.session.Phone_Number     
      Sms(phone_num) //otp    
      res.render('users/ForgotPassword/otp_forgot')
    },
    // Otp checking
    otpCheckForgot:(req,res)=>{
      let otp_code = req.body
      let phone_num = req.session.Phone_Number
      verify(phone_num,otp_code).then((status)=>{
        if(status){
        res.render('users/ForgotPassword/change_password')
        console.log('Otp verified successfully')
        }else{
          console.log('Otp verification failed')
        res.render('users/ForgotPassword/otp_forgot')
        }
      })
      res.render('users/ForgotPassword/otp_forgot')
    },
    // Change Password
    change_password:(req,res)=>{
      userHelper.ChangePassword(req.body).then((status)=>{
        if(status){
          console.log('Password changed')
          res.redirect('/login')
        }else{
          console.log('unable to change password')
        }
      })
    },
    Category_option:(req,res)=>{
      userHelper.Category_option(req.query.cName).then(async(products_view)=>{
        let user = req.session.user
        let pagination_count = 0
        let Categories =  await Category_model.find({})
        res.render('users/shop',{products_view,user,Categories,pagination_count})
      })
    },
    Cart_View: async(req,res)=>{
      if(req.session.loggedIn){
      let user = req.session.user
      userHelper.Get_Cart_Products(req.session.user._id).then(async(cart_products)=>{
        console.log(cart_products)
        let product_check = await product_model.find({_id:(cart_products)})
        console.log(product_check,'This oidfjio')
      res.render('users/Products/cart',{user})
      })
      }else{
        res.redirect('/login')
      }
    },
    add_to_cart:(req,res)=>{
        let productid = req.params._id
        let user_id = req.session.user._id
        userHelper.AddToCart(productid,user_id).then(()=>{
          res.redirect('/cart')
        })
    }
}