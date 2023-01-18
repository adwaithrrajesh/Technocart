const user_model = require("../model/User_model");
const bcrypt = require("bcrypt");
const { resolveInclude, promiseImpl } = require("ejs");
const { bulkSave, count } = require("../model/User_model");
const objectid = require("mongoose").Types.ObjectId;
const product_model = require("../model/product_model");
const cart_model = require("../model/cart_model");
const ObjectId = require("objectid");
const { Category } = require("./product_helpers");
const { response } = require("express");
const wishlist_model = require("../model/wishlist");
const address_model = require("../model/address_model");
const { default: mongoose } = require("mongoose");
const Order_model = require("../model/order_model");
const Coupon_model = require("../model/coupon")
// Razorpay
const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: "rzp_test_R1CTkXvaCjsqk3",
  key_secret: "BnNYOFdoQ76rAUxGZHK8eNkE",
});

module.exports = {
  //Signup
  doSignup: (userData) => {
    return new Promise(async (res) => {
      let user = await user_model.findOne({ Email: userData.Email });
      if (user) {
        res(false);
      } else {
        res(true);
      }
    });
  },
  // Login
  doLogin: (userData) => {
    let response = {};
    return new Promise(async (resolve) => {
      let user = await user_model.findOne({ Email: userData.Email });
      if (user) {
        userData.Password = bcrypt
          .compare(userData.Password, user.Password)
          .then((status) => {
            if (status) {
              response.status = true;
              response.user = user;
              resolve(response);
            } else {
              resolve({ status: false });
            }
          });
      } else {
        resolve({ status: false });
      }
    });
  },
  // User Management
  getAllusers: () => {
    return new Promise(async (res) => {
      let user_view = await user_model.find();
      res(user_view);
    });
  },
  // User Block
  userBlocker: (userData) => {
    return new Promise(async (res) => {
      await user_model.findOneAndUpdate(
        { _id: objectid(userData) },
        { $set: { block: true } }
      )
      res(true)
    });
  },
  // User unblock
  userUnblock: (userData) => {
    return new Promise(async (res) => {
      await user_model.findOneAndUpdate(
        { _id: objectid(userData) },
        { $set: { block: false } }
      )
      res(true)
    });
  },
  // Data insert
  dataInsert: (userData) => {
    return new Promise(async (res) => {
      userData.Password = await bcrypt.hash(userData.Password, 10);
      user_model.create(userData);
      res(true);
    });
  },
  // Change Password
  ChangePassword: (userData) => {
    return new Promise(async (res) => {
      let user = await user_model.findOne({ Email: userData.Email });
      if (user) {
        userData.Password = await bcrypt.hash(userData.Password, 10);
        await user_model.updateOne(
          { _id: objectid(user._id) },
          { $set: { Password: userData.Password } }
        );
        res(true);
      }
    });
  },
  // Category Option
  Category_option: (Data) => {
    return new Promise(async (resolve) => {
      let products_view = await product_model.find({ Category: Data });
      resolve(products_view);
    });
  },
  product_view: (page) => {
    return new Promise(async (res) => {
      let page_num = page;
      let lim = 6;
      let products_view = await product_model.find().then(() => {
        return product_model
          .find()
          .skip((page_num - 1) * lim)
          .limit(lim);
      });
      let pagination = (await product_model.find().countDocuments()) / lim;
      let pagination_count = Math.ceil(pagination);
      res({ products_view, pagination_count });
    });
  },
  Search: (searchkey) => {
    return new Promise(async (res, rej) => {
      let products_view = await product_model.find({
        ProductName: { $regex: new RegExp("^" + searchkey + ".*", "i") },
      });
      res(products_view);
    });
  },
  ProductDetails: (product_detail) => {
    return new Promise(async (res) => {
      let product = product_detail;
      let product_det = await product_model.findOne({ _id: objectid(product) });
      res(product_det);
    });
  },
  AddToCart: (Product_id, user_id) => {
    return new Promise(async (res, rej) => {
      let user_exist = await cart_model.findOne({ UserId: objectid(user_id) });
      let Product = await product_model.findOne({ _id: Product_id });
      let SubPrice = Product.DiscountPrice;
      if (user_exist) {
        let Product_Exist = user_exist.Products.findIndex(
          (product) => product.Product == Product_id
        );
        if (Product_Exist != -1) {
          await cart_model.updateOne(
            { UserId: user_id, "Products.Product": Product_id },
            {
              $inc: {
                "Products.$.Quantity": 1,
                "Products.$.Subtotal": SubPrice,
                Total: Product.DiscountPrice
              },
            }
          );
          res();
        } else {
          await cart_model.updateOne(
            { UserId: user_id },
            {
              $push: {
                Products: [{ Product: Product_id, Subtotal: SubPrice }],
              },
              $inc:{
                Total: SubPrice
              }
            }
          );
        }
        res();
      } else {
        cart = {
          UserId: user_id,
          Products: [{ Product: Product_id, Subtotal: SubPrice }],
          CouponDiscount:0,
          Total: Product.DiscountPrice
        };
        await cart_model.create(cart);
        res();
      }
    });
  },
  Get_Cart_Products: (User_id) => {
    return new Promise(async (res, rej) => {
      let cart_products = await cart_model
        .findOne({ UserId: User_id })
        .populate("Products.Product");
         res(cart_products);
    });
  },
  ChangeQuantity: ({ CartId, ProductId, Count }, userId) => {
    return new Promise(async (resolve, reject) => {
      let Product = await product_model.findOne({ _id: ProductId });
      let Price = Product.DiscountPrice;
      let cart = await cart_model.findOne({ UserId: userId });
      cart.Products.forEach((obj) => {
        if (obj.Product == ProductId) {
          Quantity = obj.Quantity;
        }
      });
      if (Count == -1 && Quantity == 1) {
        await cart_model.updateOne(
          { UserId: userId },
          {
            $pull: {
              Products: {
                Product: ProductId,
              },
            },
            $inc: { Total: Price * -1 }
          }
        );
        resolve({ removeProduct: response });
      }
      await cart_model.updateOne(
        { "Products._id": CartId, "Products.Product": ProductId },
        {
          $inc: {
            "Products.$.Quantity": Count,
            "Products.$.Subtotal": Price * Count,
            Total: Product.DiscountPrice * Count
          },
        }
      );
      resolve(response);
    });
  },
  RemoveFromCart: (userId, ProductId, Quantity) => {
    return new Promise(async (resolve, reject) => {
      let Product = await product_model.findOne({ _id: ProductId });
      let Price = Product.DiscountPrice;
      let cart = await cart_model.findOne({UserId:userId})
      let CouponDiscount = cart.CouponDiscount
      await cart_model.updateOne(
        { UserId: userId },
        {
          $pull: { Products: { Product: ProductId } },
          $inc: { Total: Price * -Quantity}
        }
      );
      resolve(response);
    });
  },
  SortLow: () => {
    return new Promise(async (resolve, reject) => {
      let products_view = await product_model.find().sort({ Price: 1 });
      let pagination_count = 1;
      resolve({ products_view, pagination_count });
    });
  },
  SortHigh: () => {
    return new Promise(async (resolve, reject) => {
      let products_view = await product_model.find().sort({ Price: -1 });
      let pagination_count = 1;
      resolve({ products_view, pagination_count });
    });
  },
  AddToWishlist: (Product_id, user_id) => {
    return new Promise(async (resolve, reject) => {
      let user_exist = await wishlist_model.findOne({
        UserId: objectid(user_id),
      });
      if (user_exist) {
        let Product_Exist = user_exist.Products.findIndex(
          (product) => product.Product == Product_id
        );
        if (Product_Exist != -1) {
          resolve({ Product_Exist: response });
        } else {
          await wishlist_model.updateOne(
            { UserId: user_id },
            {
              $push: {
                Products: [{ Product: Product_id }],
              },
            }
          );
        }
      } else {
        wishlist_items = {
          UserId: user_id,
          Products: [{ Product: Product_id }],
        };
        await wishlist_model.create(wishlist_items);
      }
    });
  },
  ViewWishlist: (user_id) => {
    return new Promise(async (resolve, reject) => {
      let wishlistItems = await wishlist_model
        .findOne({ UserId: user_id })
        .populate("Products.Product");
      resolve(wishlistItems);
    });
  },
  RemoveFromWishlist: (Product_id, User_id) => {
    return new Promise(async (resolve, reject) => {
      let removeWishlist = await wishlist_model.updateOne(
        { UserId: User_id },
        {
          $pull: {
            Products: {
              Product: Product_id,
            },
          },
        }
      );
      resolve(removeWishlist);
    });
  },
  ChangeUserDetails: (User_id, Details) => {
    return new Promise(async (resolve, reject) => {
      let user = await user_model.findByIdAndUpdate(
        { _id: User_id },
        {
          $set: {
            Email: Details.Email,
            PhoneNumber: Details.phonenumber,
            Firstname: Details.firstname,
            Lastname: Details.lastname,
          },
        }
      );
      resolve(user);
    });
  },
  AddAddress: (User_id, address) => {
    return new Promise(async (resolve, reject) => {
      let user_exist = await address_model.findOne({
        UserId: objectid(User_id),
      });
      if (user_exist) {
        await address_model.updateOne(
          { UserId: User_id },
          {
            $push: {
              Address: [
                {
                  FirstName: address.Firstname,
                  LastName: address.Lastname,
                  Email: address.Email,
                  PhoneNumber: address.PhoneNumber,
                  CompanyName: address.CompanyName,
                  CompanyAddress: address.CompanyAddress,
                  Country: address.Country,
                  Address: address.Address,
                  City: address.City,
                  State: address.State,
                  PinCode: address.Zip,
                },
              ],
            },
          }
        );

        resolve();
      } else {
        let Address = {
          UserId: User_id,
          Address: [
            {
              FirstName: address.Firstname,
              LastName: address.Lastname,
              Email: address.Email,
              PhoneNumber: address.PhoneNumber,
              CompanyName: address.CompanyName,
              CompanyAddress: address.CompanyAddress,
              Country: address.Country,
              Address: address.Address,
              City: address.City,
              State: address.State,
              PinCode: address.Zip,
            },
          ],
        };
        await address_model.create(Address);
        resolve();
      }
    });
  },
  RemoveAddress: (User_Id, Address_Id) => {
    return new Promise(async (resolve, reject) => {
      await address_model.updateOne(
        { UserId: User_Id },
        {
          $pull: { Address: { _id: Address_Id } },
        }
      );
      resolve();
    });
  },
  OrderStore: (Address_Id, Payment_Method, User_Id) => {
    return new Promise(async (resolve, reject) => {
      let cart = await cart_model.findOne({ UserId: User_Id });
      let user = await user_model.updateOne({_id:User_Id},{
        $set:{
          CouponInUse:false
        }
      })
      let Product_Array = cart.Products;
      let TotalPrice = cart.Total;
      let Order = {
        UserId: User_Id,
        Address: Address_Id,
        Products: Product_Array,
        PaymentMethod: "Cash on Delivery",
        OrderStatus:"Order Confirmed",
        Total: TotalPrice,
      };
      await Order_model.create(Order);
      resolve(response);
    });
  },
  ViewOrder: (User_Id) => {
    return new Promise(async (resolve, reject) => {
     let orders = await Order_model.find({UserId:User_Id})
     resolve(orders)
    });
  },
  GenerateRazorpay: (User_Id) => {
    return new Promise(async (resolve, reject) => {
      let cart = await cart_model.findOne({ UserId: User_Id });
      let Total = cart.Total;
      let Id = cart._id;
      let options = {
        amount: Total * 100,
        currency: "INR",
        receipt: "" + Id,
      }
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          resolve(order);
        }
      });
    });
  },
  VerifyPayment: (Details) => {
    return new Promise(async (resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "BnNYOFdoQ76rAUxGZHK8eNkE");
      hmac.update(
        Details["Payment[razorpay_order_id]"] +
          "|" +
          Details["Payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == Details["Payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },
  StoreOnlineOrder: (UserId, Address) => {
    return new Promise(async (resolve, reject) => {
      let cart = await cart_model.findOne({ UserId: UserId });  
      let Product_Array = cart.Products;
      let TotalPrice = cart.Total;
      let Order = {
        UserId: UserId,
        Address: Address,
        Products: Product_Array,
        PaymentMethod: "Online Payment",
        OrderStatus:"Order Confirmed",
        Total: TotalPrice,
      };
      await Order_model.create(Order);
      resolve(response);
    });
  },
  TrackOrder:(OrderId)=>{
    return new Promise(async(resolve,reject)=>{
      let Order = await Order_model.findOne({_id:OrderId})
      resolve(Order)
    })
  },
  CancelOrder:(OrderId)=>{
    return new Promise(async(resolve,reject)=>{
       await Order_model.updateOne({_id:OrderId},{
          $set:{
            OrderStatus: 'Order Cancelled'
        }
      })
      resolve()
    })
  },
  CouponManagement:(Code,User)=>{
    return new Promise(async(resolve,reject)=>{
      let coupon = await Coupon_model.findOne({CouponCode:Code})
      let CouponCode = coupon.CouponCode
      let LimitAmount = coupon.LimitAmount
      let cart = await cart_model.findOne({UserId:User})
      let Total = cart.Total
      let percentage = coupon.Percentage
      if(LimitAmount<=Total){
        await cart_model.updateOne({UserId : User},{
          $set:{
            CouponDiscount:LimitAmount,
            Total: parseInt(Total - LimitAmount)
          }
         })
      }else{
        await cart_model.updateOne({UserId : User},{
          $set:{
            Total: parseInt(Total - (Total*percentage)/100),
            CouponDiscount: parseInt((Total*percentage)/100)
          }
         })
      }
        await user_model.updateOne({_id:(User)},{
          $set:{
            CouponInUse : true
          },
          $push:{
            UsedCoupons:[CouponCode]
          }
        })
        resolve(Code)
    })
  },
  Filter:(min,max)=>{
    return new Promise(async(resolve,reject)=>{
      let products_view = await product_model.find({ $and: [{ DiscountPrice: { $lte: max, $gte: min } }] })
      resolve(products_view)
    })
  },
  RemoveCoupon:(Code,User)=>{
    return new Promise(async(resolve,reject)=>{
      let coupon = await Coupon_model.findOne({CouponCode:Code})
      let cart = await cart_model.findOne({UserId:User})
      let Total = cart.Total
      let percentage = coupon.Percentage
      let value = Total/(100-percentage)
      let user = await user_model.updateOne({_id:User},{
        $pull:{UsedCoupons:Code},
        $set:{CouponInUse:false}
      })
      await cart_model.updateOne({UserId : User},{
        $set:{
          Total: parseInt(value*100),
          CouponDiscount: 0
        }
       })
      resolve(true)
    })
  }
};
