const mongoose = require('../config/connection')
const { response } = require('express')
const objectid = require('mongoose').Types.ObjectId
const product_model = require('../model/product_model')
const { resolveInclude } = require('ejs')
const { update } = require('../model/admin_model')
const Category_model = require('../model/Category_model')


module.exports={
    addProduct:(productData)=>{
        return new Promise(async(res,rej)=>{
            let product_insert =  await product_model.create(productData)
            res(true)
        })
    },
    Hide_product:(ProductData)=>{
        return new Promise(async(res,rej)=>{
            await product_model.findByIdAndUpdate({_id:objectid(ProductData)},{$set:{Allow:false}})
            res(true)
        })
    },
    UnHide_product:(Data)=>{
        return new Promise(async(res,rej)=>{
            await product_model.findByIdAndUpdate({_id:objectid(Data)},{$set:{Allow:true}})
            res(true)
        })
    },
    editProduct:(ProductData)=>{
        return new Promise(async(res,rej)=>{
           let edit_product = await product_model.findOne({_id:objectid(ProductData)})
           res(edit_product)
        })
    },
    updateProduct:(ProductId,ProductData)=>{
        return new Promise(async(res,rej)=>{
            console.log(ProductData,"This is productData")
         let product_update = await product_model.findByIdAndUpdate({_id:objectid(ProductId)},{$set:{
            ProductName:ProductData.ProductName,
            Discription:ProductData.Discription,
            Category:ProductData.Category,
            Image:ProductData.Image,
            Price:ProductData.Price,
            DiscountPrice:ProductData.DiscountPrice
        }})
         res(product_update)
        }) 
    }, 
    Category:(category_data)=>{
        return new Promise(async(res,rej)=>{
            let Categorydatas = await Category_model.create(category_data)
            res(Categorydatas)
        })
    },
    Delete_Category:(Category_data)=>{
        return new Promise(async(resolve,reject)=>{
         await Category_model.deleteOne({_id:objectid(Category_data)})
          resolve()
        })
    }
} 