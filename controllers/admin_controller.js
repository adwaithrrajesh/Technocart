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
const expressFlash = require('express-flash')
const user_model = require('../model/User_model')
const coupon_model = require('../model/coupon')
const order_model = require('../model/order_model')
const banner_model = require('../model/banner_management')
const address_model = require('../model/address_model')


module.exports = {

    // Admin_login
    login:(req,res)=>{
        if(req.session.adminLoggedin){
            res.redirect('/admin/home')
          }else{
            res.render('admin/admin_login',{expressFlash: req.flash('Success')})
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
              req.flash('Success','Incorrect Email or Password');
              res.redirect('/admin')
            }
          })
    },
    // register
    Register:(req,res)=>{
      res.render('admin/Manage_Admin/admin_register',{expressFlash: req.flash('Success')})
    },
    Register_req:(req,res)=>{
      adminHelper.adminRegister(req.body).then((status)=>{
        if(status){
          res.redirect('/admin')
        }else{
          req.flash('Success','Admin Already Exist');
          res.redirect('/admin/register')
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
      adminHelper.Dashboard().then(async(Orders)=>{
        let Activeusers = await user_model.find({block:false}).countDocuments()
        let Blockedusers = await user_model.find({block:true}).countDocuments()
        let TotalProducts = await product_model.find({Allow:true}).countDocuments()
        let HiddenProducts = await product_model.find({Allow:false}).countDocuments()
        let TotalDelivery = await order_model.find({OrderStatus:'Delivered'}).countDocuments()
        adminHelper.AllowedAdmins().then((Admins)=>{
        res.render('admin/admin_home',{Orders,Activeusers,Blockedusers,TotalProducts,HiddenProducts,TotalDelivery,Admins})
        })
      })
      },

    // User Management
    user_management:(req,res)=>{
        user_helpers.getAllusers().then((user_view)=>{
          res.render('admin/user/user_management',{user_view})
        })
    },
    // User block
    user_block:(req,res)=>{
      let user = req.body.user
        user_helpers.userBlocker(user).then(()=>{
          res.json(true)
        })
      },
    // User unblock
    user_unblock:(req,res)=>{
      let user = req.body.user
        user_helpers.userUnblock(user).then(()=>{
          res.json(true)
        })
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
        res.redirect('/admin')
      }
    },
    // Admin Allow 
    adminAllow:(req,res)=>{
      let admin = req.body.admin
      adminHelper.adminAllow(admin).then(()=>{
        res.json(true)
      })
    },
    // Admin Block 
    adminBlock:(req,res)=>{
      let admin = req.body.admin
      adminHelper.BlockAdmin(admin).then(()=>{
        res.json(true)
      })
    },
    OrderManagement:(req,res)=>{
      adminHelper.OrderView().then((orders)=>{
        res.render('admin/OrderManagement/Order_management',{orders})
      })
    },
    ChangeOrderStatus:(req,res)=>{
      let OrderId = req.body.OrderId
      let value = req.body.value
      adminHelper.ChangeOrderStatus(OrderId,value).then(()=>{
        res.json(true)
      })
    },
    CouponManagement: async(req,res)=>{
      let Coupon = await coupon_model.find()
      res.render('admin/ManageCoupon/Coupon_Management',{Coupon})
    },
    AddCoupon:(req,res)=>{
      res.render('admin/ManageCoupon/CreateCoupon')
    },
    CreateCoupon:(req,res)=>{
      let data = req.body
      adminHelper.CreateCoupon(data).then(()=>{
        res.redirect('/admin/CouponManagement')
      })
    },
    DeleteCoupon:(req,res)=>{
      let CouponId = req.body.CouponId
      adminHelper.DeleteCoupon(CouponId).then(()=>{
        res.json(true)
      })
    },
    Banner:async(req,res)=>{
      let banner = await banner_model.find()
      res.render('admin/BannerManagement/Banner_Management',{banner})
    },
    Addbanner: async(req,res)=>{
      res.render('admin/BannerManagement/AddBanner')
    },
    UploadBanner:(req,res)=>{
      let Image = req.file.filename
      let BannerName = req.body.BannerName
      adminHelper.UploadBanner(BannerName,Image).then(()=>{
        res.redirect('/admin/Banner_Management')
      })
    },
    EditBanner:(req,res)=>{
      let BannerId = req.params._id
      adminHelper.EditBanner(BannerId).then((banner)=>{
        res.render('admin/BannerManagement/EditBanner',{banner})
      })
    },
    EditBannerInsert:(req,res)=>{
     let BannerName = req.body.BannerName
     let Image = req.file.filename
     let Id = req.params._id
     adminHelper.EditBannerInsert(Id,BannerName,Image).then(()=>{
      res.redirect('/admin/Banner_Management')
     })
    },
    HideBanner:(req,res)=>{
      let BannerId = req.body.BannerId
      adminHelper.HideBanner(BannerId).then(()=>{
        res.json(true)
      })
    },
    UnHideBanner:(req,res)=>{
      let BannerId = req.body.BannerId
      adminHelper.UnHideBanner(BannerId).then(()=>{
        res.json(true)
      })
    },
    DeleteBanner:(req,res)=>{
      let BannerId = req.body.BannerId
      adminHelper.DeleteBanner(BannerId).then(()=>{
        res.json(true)
      })
    },
    OrderDetails:async(req,res)=>{
      let OrderId = req.params._id
      adminHelper.OrderDetails(OrderId).then(async({Products,User})=>{
        res.render('admin/OrderManagement/Order_details',{Products,User})
      })
    },
    PaymentDetails: async(req,res)=>{
      let OnlinePayment = await order_model.find({PaymentMethod:'Online Payment'}).countDocuments()
      let CashOnDelivery = await order_model.find({PaymentMethod:'Cash on Delivery'}).countDocuments()
      res.json({OnlinePayment,CashOnDelivery})
    }
}