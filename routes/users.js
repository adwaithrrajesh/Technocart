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
router.get('/productDetails/:_id',BlockAuth,ProductController.productDetails)
router.get('/forgot-password',Controller.forgotPassword)
router.get('/category-opt',BlockAuth,Controller.categoryOption)
router.get('/cart',UserAuth,BlockAuth,Controller.cartView)
router.get('/checkout',UserAuth,BlockAuth,Controller.checkout)
router.get('/sort-low',BlockAuth,Controller.sortLow)
router.get('/sort-high',BlockAuth,Controller.sortHigh)
router.get('/wishlist',UserAuth,BlockAuth,Controller.wishList)
router.get('/userProfile',UserAuth,BlockAuth,Controller.userProfile)
router.get('/add-address',UserAuth,BlockAuth,Controller.addressPage)
router.get('/order-success',UserAuth,BlockAuth,Controller.orderSuccess)
router.get('/track-order/:_id',UserAuth,BlockAuth,Controller.orderStatus)
router.get('/contact',BlockAuth,Controller.Contact)
router.get('/coupon',UserAuth,BlockAuth,Controller.couponView)



// Post 
router.post('/login',Controller.loginPost)
router.post('/registered',Controller.register)
router.post('/otp-send',Controller.otpCheck)
router.post('/otp_verification',Controller.phoneNumber)
router.post('/otp_send_forgot',Controller.otpCheckForgot)
router.post('/change_password',Controller.changePassword)
router.post('/search',Controller.search)
router.post('/changequantity',Controller.Quantity)
router.post('/remove_product',UserAuth,Controller.removeProduct)
router.post('/addCart',UserAuth,Controller.addCart)
router.post('/addWishlist',UserAuth,Controller.AddtoWishlist)
router.post('/remove_wishlist',UserAuth,Controller.RemoveWishlist)
router.post('/change_userdetails',Controller.changeDetails)
router.post('/store_address',Controller.storeAddress)
router.post('/remove_address',Controller.removeAddress)
router.post('/order_details',Controller.orderSubmit)
router.post('/verify_payment',Controller.verifyPayment)
router.post('/cancel_order',Controller.cancelOrder)
router.post('/couponcode',Controller.couponCode)
router.post('/filterprice',Controller.filterPrice)
router.post('/removeCoupon',Controller.removeCoupon)
 


module.exports = router;
