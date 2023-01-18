const { query } = require('express');
const express = require('express');
const session = require('express-session');
const router = express.Router();
let adminHelper = require('../helpers/admin_helper');
const user_helpers = require('../helpers/user_helpers');
const auth = require('../middleware/auth')
const admin_auth = auth.admin_auth
const Controller = require('../controllers/admin_controller')
const upload = require('../middleware/multer')
const ProductController = require('../controllers/product_controller')


// Get 

  router.get('/',Controller.login) 
  router.get('/logout',Controller.logout)
  router.get('/home',admin_auth,Controller.home)
  router.get('/user_management',admin_auth,Controller.user_management)
  router.get('/product_management',admin_auth,Controller.productManagement)
  router.get('/add_products',admin_auth,Controller.add_product) 
  router.get('/admin_management',admin_auth,Controller.adminManagement)
  router.get('/register',Controller.Register)
  router.get('/category',admin_auth,ProductController.Category)
  router.get('/order_management',admin_auth,Controller.OrderManagement)
  router.get('/Banner_Management',admin_auth,Controller.Banner)
  router.get('/CouponManagement',Controller.CouponManagement)
  router.get('/CreateCoupon',Controller.AddCoupon)

  
  
  // Post
  router.post('/admin_log',Controller.login_post)
  router.post('/admin_reg',Controller.Register_req)
  router.post('/block_user',admin_auth,Controller.user_block)
  router.post('/user_unblock',admin_auth,Controller.user_unblock)
  router.post('/allow_admin',admin_auth,Controller.adminAllow)  
  router.post('/block_admin',admin_auth,Controller.adminBlock)  
  router.post('/add_product',admin_auth,upload.array('Image',4),ProductController.InsertProduct)
  router.post('/hide_product',admin_auth,ProductController.HideProduct)
  router.post('/show_product',admin_auth,ProductController.ShowProduct)
  router.post('/edit_product/:_id',admin_auth,ProductController.edit_product)
  router.post('/update_product/:_id',admin_auth,upload.single('Image'),ProductController.update_product)
  router.post('/add_category',ProductController.addCategory)  
  router.post('/delete_category',ProductController.DeleteCategory)
  router.post('/Change_status',admin_auth,Controller.ChangeOrderStatus)
  router.post('/coupon',admin_auth,Controller.CreateCoupon)
  router.post('/DeleteCoupon',Controller.DeleteCoupon)







module.exports = router;