const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const BlockAuth = auth.BlockAuth
const UserAuth = auth.UserAuth
const Controller = require('../controllers/user_controller')
const ProductController = require('../controllers/product_controller')




// Get
router.get('/login',Controller.login)
router.get('/logout',Controller.logout)
router.get('/register',Controller.signup)
router.get('/',BlockAuth,Controller.home)
router.get('/shop',BlockAuth,Controller.shop)
router.get('/otp',Controller.otp)
router.get('/productDetails/:_id',BlockAuth,ProductController.ProductDetails)
router.get('/forgot_password',Controller.forgot_password)
router.get('/category_opt',BlockAuth,Controller.Category_option)
router.get('/cart',UserAuth,BlockAuth,Controller.Cart_View)
router.get('/checkout',UserAuth,BlockAuth,Controller.Checkout)
router.get('/sort_low',BlockAuth,Controller.SortLow)
router.get('/sort_high',BlockAuth,Controller.SortHigh)
router.get('/wishlist',UserAuth,BlockAuth,Controller.Wishlist)
router.get('/UserProfile',UserAuth,BlockAuth,Controller.UserProfile)
router.get('/add_address',UserAuth,BlockAuth,Controller.Address_page)
router.get('/order_success',UserAuth,BlockAuth,Controller.OrderSuccess)
router.get('/track_order/:_id',UserAuth,BlockAuth,Controller.OrderStatus)
router.get('/contact',BlockAuth,Controller.Contact)
router.get('/coupon',UserAuth,BlockAuth,Controller.CouponView)







// Post 
router.post('/login_req',Controller.login_post)
router.post('/registered',Controller.register)
router.post('/otp_send',Controller.otpCheck)
router.post('/otp_verification',Controller.phonenumber)
router.post('/otp_send_forgot',Controller.otpCheckForgot)
router.post('/change_password',Controller.change_password)
router.post('/search',Controller.search)
router.post('/changequantity',Controller.Quantity)
router.post('/remove_product',UserAuth,Controller.RemoveProduct)
router.post('/addCart',UserAuth,Controller.AddCart)
router.post('/addWishlist',UserAuth,Controller.AddtoWishlist)
router.post('/remove_wishlist',UserAuth,Controller.RemoveWishlist)
router.post('/change_userdetails',Controller.ChangeDetails)
router.post('/store_address',Controller.StoreAddress)
router.post('/remove_address',Controller.RemoveAddress)
router.post('/order_details',Controller.OrderSubmit)
router.post('/verify_payment',Controller.VerifyPayment)
router.post('/cancel_order',Controller.CancelOrder)
router.post('/couponcode',Controller.CouponCode)
router.post('/filterprice',Controller.FilterPrice)
router.post('/removeCoupon',Controller.RemoveCoupon)
router.post('/DownloadSalesReport',Controller.DownloadReport)
 


module.exports = router;
