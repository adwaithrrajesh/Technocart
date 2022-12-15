const { query } = require('express');
const express = require('express');
const session = require('express-session');
const { adminView } = require('../helpers/admin_helper');
const router = express.Router();
let adminHelper = require('../helpers/admin_helper');
const user_helpers = require('../helpers/user_helpers');
let productHelpers = require('../helpers/product_helpers');
const { product_view } = require('../helpers/product_helpers');
const { getMaxListeners } = require('../model/product_model');
const Category_model = require('../model/Category_model')
const product_model = require('../model/product_model')


module.exports = {

    // Admin_login
    login:(req,res)=>{
        if(req.session.adminLoggedin){
            res.redirect('/admin/home')
          }else{
            res.render('admin/admin_login')
          }
    },
    // Login Post
    login_post:(req,res)=>{
        adminHelper.adminLogin(req.body).then((status)=>{
          req.session.admin = req.body
            if(status){
              req.session.adminLoggedin = true
              res.redirect('/admin/home')
            }else{
              console.log('An error found at Admin side')
            }
          })
    },

    // Logout
    logout:(req,res)=>{
        req.session.destroy()
        res.redirect('/admin')
    },

    // Home
    home:(req,res)=>{
        res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0')
        res.render('admin/admin_home')
      },

    // User Management
    user_management:(req,res)=>{
        user_helpers.getAllusers().then((user_view)=>{
          res.render('admin/user/user_management',{user_view})
        })
    },
    // User block
    user_block:(req,res)=>{
        user_helpers.userBlocker(req.params._id)
        res.redirect('/admin/user_management')
      },
    // User unblock
    user_unblock:(req,res)=>{
        user_helpers.userUnblock(req.params._id)
        res.redirect('/admin/user_management')
      },
    // Product Management
    productManagement: async(req,res)=>{
      let products_view = await product_model.find()
        res.render('admin/products/product_management',{products_view})
    },
    // add product
    add_product:async (req,res)=>{
      let Categorydatas = await Category_model.find()
      res.render('admin/products/add_product',{Categorydatas})
    },
    // Super Admin
    adminManagement:(req,res)=>{
      let admin = req.session.admin
      let email = 'i@gmail.com'
      if(admin.Email == email){
        adminHelper.adminView().then((admin_details)=>[
          res.render('admin/Manage_Admin/admin_management',{admin_details})
        ])
      }else{
        res.redirect('/admin/')
      }
    },
    // register
    Register:(req,res)=>{
      res.render('admin/Manage_Admin/admin_register')
    },
    Register_req:(req,res)=>{
      adminHelper.adminRegister(req.body).then((status)=>{
        if(status){
          res.redirect('/admin')
        }else{
          console.log('Admin Already Exist')
        }
      })
    },
    // Admin Allow 
    adminAllow:(req,res)=>{
      adminHelper.adminAllow(req.params._id)
      res.redirect('/admin/admin_management')
    },
    // Admin Block 
    adminBlock:(req,res)=>{
      adminHelper.BlockAdmin(req.params._id)
        res.redirect('/admin/admin_management')
    }

}