const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const user_auth = auth.user_auth
const Controller = require('../controllers/user_controller')
const ProductController = require('../controllers/product_controller')




// Get
router.get('/login',Controller.login)
router.get('/logout',Controller.logout)
router.get('/register',Controller.signup)
router.get('/',user_auth,Controller.home)
router.get('/shop',user_auth,Controller.shop)
router.get('/otp',Controller.otp)
router.get('/productDetails/:_id',ProductController.ProductDetails)
router.get('/forgot_password',Controller.forgot_password)
router.get('/category_opt',Controller.Category_option)
router.get('/add_to_cart/:_id',user_auth,Controller.add_to_cart)
router.get('/cart',user_auth,Controller.Cart_View)



// Post 
router.post('/login_req',Controller.login_post)
router.post('/registered',Controller.register)
router.post('/otp_send',Controller.otpCheck)
// forgot password
router.post('/otp_verification',Controller.phonenumber)
router.post('/otp_send_forgot',Controller.otpCheckForgot)
router.post('/change_password',Controller.change_password)

 


module.exports = router;
