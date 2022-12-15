const express = require('express');
const session = require('express-session');
const router = express.Router();
let productHelpers = require('../helpers/product_helpers');
const { product_view, updateProduct } = require('../helpers/product_helpers');
const { Category } = require('./admin_controller');
const Category_model = require('../model/Category_model');
const user_helpers = require('../helpers/user_helpers');


module.exports={

  // Insert Product
    InsertProduct:(req,res)=>{
        console.log(req.body,'products')
        console.log(req.files)
        let product = {
          ProductName:req.body.ProductName,
          Image:req.files,
          Discription:req.body.Discription,
          Price:req.body.Price,
          DiscountPrice:req.body.DiscountPrice,
          Category:req.body.Category
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
      // Delete Product
      DeleteProduct:(req,res)=>{
        productHelpers.Delete_product(req.params._id)
          res.redirect('/admin/product_management')
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
      user_helpers.ProductDetails(req.params._id).then((product_det)=>{
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
      productHelpers.Delete_Category(req.params._id).then((deleted)=>{
        res.redirect('/admin/category')
      })
    }


  }

