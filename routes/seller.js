const express = require('express')
const router = express.Router();
const Controller = require('../controllers/seller_controller')
const Seller = require('../middleware/auth')
const Auth = Seller.SellerAuth


// Get 
router.get('/login',Controller.Login)
router.get('/',Auth,Controller.Home)
router.get('/add_product',Controller.AddProduct)
router.get('/logout',Controller.Logout)

// Post 
router.post('/register',Controller.Register)
router.post('/otp-send',Controller.Otp)
router.post('/seller_login',Controller.DoLogin)




module.exports = router;
