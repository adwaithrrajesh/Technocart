const express = require('express');
const session = require('express-session');
const router = express.Router();
let productHelpers = require('../helpers/product_helpers');
const { product_view, updateProduct } = require('../helpers/product_helpers');
const { Category } = require('./admin_controller');
const Category_model = require('../model/Category_model');
const user_helpers = require('../helpers/user_helpers');
const cart_model = require('../model/cart_model')


module.exports={

  // Insert Product
    InsertProduct:(req,res)=>{
      let trend = req.body.Trending
        let product = {
          ProductName:req.body.ProductName,
          Image:req.files,
          Discription:req.body.Discription,
          Price:req.body.Price,
          DiscountPrice:req.body.DiscountPrice,
          Category:req.body.Category,
          Trending:trend
        }
        productHelpers.addProduct(product).then((status)=>{
          if(status){
            console.log('Data Inserted Successfully')
            res.redirect('/admin/add_products')
          }else{
            console.log('Unable to insert Data')
          }
        })
      },
      // Hide Product
      HideProduct:(req,res)=>{
        let Product = req.body.Product
        productHelpers.Hide_product(Product).then(()=>{
          res.json(true)
        })
      },
      // Show Product
      ShowProduct:(req,res)=>{
        let Product = req.body.Product
        productHelpers.UnHide_product(Product).then(()=>{
          res.json(true)
        })
      },
       // edit product
    edit_product:(req,res)=>{
      productHelpers.editProduct(req.params._id).then((edit_product)=>{
        res.render('admin/products/edit_product',{edit_product})
      })
      },
      // update
      update_product:(req,res)=>{
        let productid = req.params._id
        let product = {
          ProductName:req.body.ProductName,
          Image:req.file,
          Discription:req.body.Discription,
          Price:req.body.Price,
          DiscountPrice:req.body.DiscountPrice,
          Category:req.body.Category
        }
        productHelpers.updateProduct(productid,product).then((product_update)=>{
          console.log(product_update,"Product updated successfully")
          res.redirect('/admin/product_management')
        })
      },
      // Product Details
     ProductDetails:(req,res)=>{
      let user = req.session.user
      user_helpers.ProductDetails(req.params._id).then(async(product_det)=>{
        res.render('users/Products/product_details',{product_det,user})
      })    
     },
      // Category
    Category:async(req,res)=>{
      let Categorydatas = await Category_model.find({})
      res.render('admin/Category/category',{Categorydatas})
    },
    //  Add Category
     addCategory:(req,res)=>{
      productHelpers.Category(req.body).then(()=>{
        res.redirect('/admin/category')
      })
     },
    //  DeleteCategory
    DeleteCategory:(req,res)=>{
      let Category = req.body.Category
      productHelpers.Delete_Category(Category).then(()=>{
        res.json(true)
      })
    }
  }

