const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const userHelper = require("../helpers/user_helpers");
const user_model = require("../model/User_model");
const auth = require("../middleware/auth");
const user_auth = auth.user_auth;
const otp = require("../helpers/otp");
const { Sms, verify } = require("../helpers/otp");
const { countDocuments, findOne } = require("../model/User_model");
const ProductHelper = require("../helpers/product_helpers");
const { product_view } = require("../helpers/product_helpers");
const Category_model = require("../model/Category_model");
const product_model = require("../model/product_model");
const { Category } = require("./product_controller");
const ObjectId = require("objectid");
const cart_model = require("../model/cart_model");
const { response } = require("express");
const wishlist_model = require("../model/wishlist");
const address_model = require("../model/address_model");
const flash = require("express-flash");
const order_model = require("../model/order_model");
const coupon_model = require("../model/coupon");
var moment = require("moment");

module.exports = {
  // Signup
  signup: (req, res) => {
    res.render("users/signup", { expressFlash: req.flash("Success") });
  },
  //register(post)
  register: (req, res) => {
    req.session.phoneNumber = req.body.PhoneNumber;
    let phone = req.session.phoneNumber;
    req.session.user = req.body;
    userHelper.doSignup(req.body).then((status) => {
      if (status) {
        otp.Sms(phone); //otp
        res.redirect("/otp");
      } else {
        req.flash("Success", "User Already Exist");
        res.redirect("/register");
      }
    });
  },
  //Login
  login: (req, res) => {
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      res.render("users/login", { expressFlash: req.flash("Success") });
    }
  },
  //Login post
  login_post: (req, res) => {
    userHelper.doLogin(req.body).then((response) => {
      if (response.status == true) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect("/");
      } else {
        req.flash("Success", "Invalid Email or Password");
        res.redirect("/login");
      }
    });
  },
  // Logout
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
  // Home
  home: async (req, res) => {
    let login = req.session.loggedIn;
    let user = req.session.user;
    let products = await product_model.find();
    if (login) {
      let cart = await cart_model
        .findOne({ UserId: req.session.user._id })
        .populate("Products.Product");
      res.render("users/home", { user, cart, products });
    } else {
      res.render("users/home", { user: false, products });
    }
  },
  // Shop
  shop: (req, res) => {
    let user = req.session.user;
    let page = req.query.page;
    let login = req.session.loggedIn;
    userHelper
      .product_view(page)
      .then(async ({ products_view, pagination_count }) => {
        let Categories = await Category_model.find();
        res.render("users/shop", {
          user,
          products_view,
          Categories,
          pagination_count,
        });
      });
  },

  // Otp
  otp: (req, res) => {
    res.render("users/otp");
  },
  // Otp Check
  otpCheck: (req, res) => {
    let otp_code = Object.values(req.body);
    otp_code = otp_code.join();
    otp_code = otp_code.split(",").join("");
    let phone = req.session.phoneNumber;
    let user = req.session.user;
    verify(phone, otp_code).then((status) => {
      if (status) {
        userHelper.dataInsert(user).then((status) => {
          if (status) {
            res.redirect("/login");
          } else {
            res.redirect("/otp");
          }
        });
      } else {
        res.redirect("/otp");
      }
    });
  },
  // Forgot password
  forgot_password: (req, res) => {
    res.render("users/ForgotPassword/Enter_number");
  },
  // Give phone number input
  phonenumber: (req, res) => {
    req.session.Phone_Number = req.body.PhoneNumber;
    let phone_num = req.session.Phone_Number;
    Sms(phone_num); //otp
    res.render("users/ForgotPassword/otp_forgot");
  },
  // Otp checking
  otpCheckForgot: (req, res) => {
    let otp_code = Object.values(req.body);
    otp_code = otp_code.join();
    otp_code = otp_code.split(",").join("");
    let phone_num = req.session.Phone_Number;
    console.log(otp_code);
    verify(phone_num, otp_code).then((status) => {
      if (status) {
        res.render("users/ForgotPassword/change_password");
      } else {
        res.render("users/ForgotPassword/change_password");
      }
    });
    res.render("users/ForgotPassword/change_password");
  },
  // Change Password
  change_password: (req, res) => {
    userHelper.ChangePassword(req.body).then((status) => {
      if (status) {
        res.redirect("/login");
      } else {
        res.render("users/ForgotPassword/change_password");
      }
    });
  },
  // Search
  search: async (req, res) => {
    let searchkey = req.body.searchinput;
    let user = req.session.user;
    let login = req.session.loggedIn;
    let Categories = await Category_model.find();
    let pagination_count = req.session.pagination_count;
    // Send to helpers
    userHelper.Search(searchkey).then(async (products_view) => {
      if (products_view) {
        res.render("users/shop", {
          user,
          Categories,
          products_view,
          pagination_count,
        });
      }
    });
  },
  // Category
  Category_option: (req, res) => {
    userHelper.Category_option(req.query.cName).then(async (products_view) => {
      let user = req.session.user;
      let pagination_count = 0;
      let Categories = await Category_model.find({});
      res.render("users/shop", {
        products_view,
        user,
        Categories,
        pagination_count,
      });
    });
  },
  // Cart View
  Cart_View: async (req, res) => {
      let user = req.session.user;
      let user_check = await cart_model.findOne({ UserId: user._id });
      let userCheck = await user_model.findOne({ _id: user });
      let CouponInUse = userCheck.CouponInUse;
      let CouponCode = req.session.Coupon;
      if (user_check) {
        userHelper
          .Get_Cart_Products(req.session.user._id)
          .then(async (cart_products) => {
            let cart = cart_products;
            res.render("users/Products/cart", {
              user,
              cart,
              CouponInUse,
              CouponCode,
            });
          });
      }
  },
  Quantity: async (req, res) => {
    let userId = req.session.user._id;
    userHelper.ChangeQuantity(req.body, userId).then((response) => {
      res.json(response);
    });
  },
  RemoveProduct: (req, res) => {
    User = req.session.user._id;
    Product = req.body.ProductId;
    Quantity = req.body.Quantity;
    userHelper.RemoveFromCart(User, Product, Quantity).then((response) => {
      res.json(response);
    });
  },
  AddCart: (req, res) => {
    let productid = req.body.ProductId;
    let user_id = req.session.user._id;
    userHelper.AddToCart(productid, user_id).then(() => {
      res.json(true);
    });
  },
  SortLow: (req, res) => {
    let user = req.session.user;
    userHelper.SortLow().then(async ({ products_view, pagination_count }) => {
      let Categories = await Category_model.find();
      res.render("users/shop", {
        user,
        Categories,
        products_view,
        pagination_count,
      });
    });
  },
  SortHigh: (req, res) => {
    let user = req.session.user;
    userHelper.SortHigh().then(async ({ products_view, pagination_count }) => {
      let Categories = await Category_model.find();
      res.render("users/shop", {
        user,
        Categories,
        products_view,
        pagination_count,
      });
    });
  },
  Wishlist: async (req, res) => {
    let user = req.session.user;
      userHelper.ViewWishlist(user._id).then((wishlistItems) => {
        res.render("users/Products/wishlist", { user, wishlistItems });
      })
  },
  AddtoWishlist: (req, res) => {
    let ProductId = req.body.ProductId;
    let UserId = req.session.user._id;
    userHelper.AddToWishlist(ProductId, UserId).then((response) => {
      res.json(response);
    });
  },
  RemoveWishlist: (req, res) => {
    let ProductId = req.body.ProductId;
    let UserId = req.session.user._id;
    userHelper.RemoveFromWishlist(ProductId, UserId).then(() => {
      res.json(true);
    });
  },
  UserProfile: async (req, res) => {
    let user = req.session.user;
    let address = await address_model.find({ UserId: user._id });
    userHelper.ViewOrder(user._id).then(async (orders) => {
      res.render("users/Profile/profile", { user, orders, address });
    });
  },
  ChangeDetails: async (req, res) => {
    let userId = req.session.user._id;
    let Details = req.body;
    userHelper.ChangeUserDetails(userId, Details).then(() => {
      res.render("users/Profile/profile");
    });
  },
  Checkout: async (req, res) => {
    let user = req.session.user;
    if (user) {
      let address_check = await address_model.findOne({ UserId: user._id });
      if (address_check) {
        let address = await address_model.find({ UserId: user._id });
        userHelper
          .Get_Cart_Products(req.session.user._id)
          .then(async (cart_products) => {
            let cart = cart_products;
            res.render("users/Products/checkout", { user, address, cart });
          });
      } else {
        res.redirect("/add_address");
      }
    } else {
      res.redirect("/login");
    }
  },
  Address_page: (req, res) => {
    let user = req.session.user;
    res.render("users/Products/add_address", { user });
  },
  StoreAddress: (req, res) => {
    let Address = req.body;
    let user = req.session.user._id;
    userHelper.AddAddress(user, Address).then(() => {
      res.redirect("/checkout");
    });
  },
  RemoveAddress: (req, res) => {
    let user = req.session.user._id;
    let address = req.body.Address;
    userHelper.RemoveAddress(user, address).then(() => {
      res.redirect("/checkout");
    });
  },
  OrderSubmit: (req, res) => {
    let Payment = req.body.Payment;
    let address = req.body.id;
    req.session.address = address;
    let User_Id = req.session.user._id;
    if (address == "undefined") {
      res.json({ address_undefined: true });
    } else {
      if (Payment == "OnlinePayment") {
        userHelper.GenerateRazorpay(User_Id).then((order) => {
          res.json({ order });
        });
      } else {
        userHelper
          .OrderStore(address, Payment, User_Id)
          .then(async (response) => {
            await cart_model.deleteOne({ UserId: User_Id });
            res.json({ codSuccess: true });
          });
      }
    }
  },
  VerifyPayment: (req, res) => {
    userHelper.VerifyPayment(req.body).then(() => {
      let address = req.session.address;
      let User_Id = req.session.user._id;
      userHelper.StoreOnlineOrder(User_Id, address).then(async () => {
        await cart_model.deleteOne({ UserId: User_Id });
        res.json(true);
      });
    });
  },
  OrderSuccess: (req, res) => {
    res.render("users/Order/order_successful");
  },
  OrderStatus: (req, res) => {
    let orderId = req.params._id;
    let user = req.session.user;
    let cart;
    userHelper.TrackOrder(orderId).then((Order) => {
      res.render("users/Order/order_tracking", { user, cart, Order });
    });
  },
  CancelOrder: (req, res) => {
    let Order = req.body.OrderId;
    userHelper.CancelOrder(Order).then(() => {
      res.json(true);
    });
  },
  Contact: (req, res) => {
    let user = req.session.user;
    let cart;
    res.render("users/aboutproject/contactme", { user, cart });
  },
  CouponCode: async (req, res) => {
    let date = Date();
    let Code = req.body.coupon;
    let User = req.session.user._id;
    let cart = await cart_model.findOne({ UserId: User });
    let coupon = await coupon_model.findOne({ CouponCode: Code });
    if (new Date(coupon.ExpiryDate) > new Date(date)) {
      console.log("Expired");
    } else {
      if (!coupon) {
        res.json({ Invalid: true });
      } else {
        let CouponUsed = await user_model.findOne({ _id: User });
        CouponUsed.UsedCoupons.forEach((element) => {
          if (Code == element) {
            AlreadyTaken = Code;
          } else {
            AlreadyTaken = "Code";
          }
        });
        if (Code == AlreadyTaken) {
          res.json({ AlreadyTaken: true });
        } else {
          if (cart.Total <= coupon.MinAmount) {
            res.json({ NeedAmount: true });
          } else {
            userHelper.CouponManagement(Code, User).then((Code) => {
              req.session.Coupon = Code;
              res.json(true);
            });
          }
        }
      }
    }
  },
  CouponView: async (req, res) => {
    let user = req.session.user;
    let cart;
    let coupon = await coupon_model.find();
    res.render("users/Coupons/Coupon", { user, cart, coupon });
  },
  FilterPrice: (req, res) => {
    let min = req.body.min;
    let max = req.body.max;
    userHelper
      .Filter(min, max)
      .then(async (products_view, pagination_count) => {
        let Categories = await Category_model.find();
        let user = req.session.user;
        res.render("users/shop", {
          user,
          products_view,
          Categories,
          pagination_count,
        });
      });
  },
  RemoveCoupon: (req, res) => {
    let Code = req.body.Code;
    let User = req.session.user._id;
    userHelper.RemoveCoupon(Code, User).then(() => {
      res.json(true);
    });
  },
};
