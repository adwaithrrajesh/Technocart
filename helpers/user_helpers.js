const user_model = require('../model/User_model')
const bcrypt = require('bcrypt');
const { resolveInclude, promiseImpl } = require('ejs');
const { bulkSave } = require('../model/User_model');
const objectid = require('mongoose').Types.ObjectId
const product_model = require('../model/product_model');
const cart_model = require('../model/cart_model');
const ObjectId = require('objectid');
const { Category } = require('./product_helpers');



module.exports = {
    //Signup 
    doSignup:(userData)=>{
        return new Promise(async(res)=>{
            let user = await user_model.findOne({Email:userData.Email})
            if(user){
                res(false)
            }else{
                res(true)
            }
        })
    },
    // Login 
    doLogin:(userData)=>{
        let response = {}
        return new Promise (async(resolve)=>{
            let user = await user_model.findOne({Email:userData.Email})
            if(user){
                    userData.Password = bcrypt.compare(userData.Password,user.Password).then((status)=>{
                        if(status){
                            response.status = true;
                            response.user = user;
                            resolve(response)
                        }else{
                            console.log("Login Failed")
                            resolve({status:false})
                        }
                    })
            }else{
                console.log("login FAiled")
                resolve({status:false})
            }
        })
    },
    // User Management
    getAllusers:()=>{
        return new Promise(async(res)=>{
            let user_view = await user_model.find()
            res(user_view)
        })
    },
    // User Block
    userBlocker:(userData)=>{
        return new Promise(async()=>{
        await user_model.findOneAndUpdate({_id:objectid(userData)},{$set:{block:true}})
        })
    },
    // User unblock
    userUnblock:(userData)=>{
        return new Promise(async()=>{
            await user_model.findOneAndUpdate({_id:objectid(userData)},{$set:{block:false}})
        })
    },
    // Data insert
    dataInsert:(userData)=>{
        return new Promise(async(res)=>{
            userData.Password = await bcrypt.hash(userData.Password,10)
            user_model.create(userData)
            res(true)
        })
    },
    // Change Password
    ChangePassword:(userData)=>{ 
        console.log(userData,"This is user data")
        return new Promise(async(res)=>{
            let user = await user_model.findOne({Email:userData.Email})
            if(user){
                userData.Password = await bcrypt.hash(userData.Password,10) 
                await user_model.updateOne({_id:objectid(user._id)},{$set:{Password:userData.Password}}) 
                res(true)           
            }
        })
    },
    // Category Option
    Category_option:(Data)=>{
        return new Promise(async(resolve)=>{
            let products_view = await product_model.find({Category:Data})
            resolve(products_view)
        })
    },
    product_view:(page)=>{
        return new Promise(async(res)=>{
            let page_num = page
            let lim = 8
            let products_view = await product_model.find().then(()=>{
                return product_model.find() 
                .skip((page_num-1)*lim)
                .limit(lim)
            })
            let pagination = await product_model.find().countDocuments()/lim    
            let pagination_count = Math.ceil(pagination)
            res({products_view,pagination_count})
        })
    },
    ProductDetails:(product_detail)=>{
        return new Promise(async(res)=>{
            let product = product_detail
            console.log(product)
            let product_det = await product_model.findOne({_id:objectid(product)}) 
            res(product_det)
        }) 
    },
    AddToCart:(Product_id,user_id)=>{
        return new Promise(async(res,rej)=>{
            let user_exist = await cart_model.findOne({UserId:objectid(user_id)})
            if(user_exist){
                await cart_model.updateOne({UserId:(user_id)},{
                    $push:{
                        Products:[{Product:Product_id}]
                    }
                })
            }else{
                cart = {
                    UserId : (user_id),
                    Products :[{Product:Product_id}]
                }
                await cart_model.create(cart)
                res()
            }
        })
    },
    Get_Cart_Products:(User_id)=>{
        return new Promise(async(res,rej)=>{
            let cart_products = await cart_model.find({UserId:User_id},{
                Products:1,_id:0
            }).populate('Products.Product').lean() 
            res(cart_products)
        })
    }
}
