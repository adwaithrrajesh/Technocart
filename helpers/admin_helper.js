const mongoose = require('../config/connection')
const bcrypt = require('bcrypt')
const admin_model = require('../model/admin_model')
const user_model = require('../model/User_model')
const admin_reg_model = require('../model/admin_reg_model')
const { response } = require('express')
const objectid = require('mongoose').Types.ObjectId
const order_model = require('../model/order_model')
const coupon_model = require('../model/coupon')
const BannerModel = require('../model/banner_management')
const product_model = require('../model/product_model')
const address_model = require('../model/address_model')


module.exports={

// Login
    adminLogin:(adminData)=>{
        return new Promise(async(res,rej)=>{
            let admin = await admin_model.findOne({Email:adminData.Email})
            let admin_req = await admin_reg_model.findOne({Email:adminData.Email})
            if(admin){
               adminData.Password = bcrypt.compare(adminData.Password,admin.Password).then((status)=>{
                    if(status){
                        res(true)  
                    }else{
                        res()
                    }
                })
            }
            else if(admin_req){
                let allow = admin_req.Allow
                if(allow){
                    adminData.Password = bcrypt.compare(adminData.Password,admin_req.Password).then((status)=>{
                        if(status){
                            res(true)  
                        }else{
                            res()
                        }
                    })
                }
            }
            else{
               res()
            }
        })
    },
    // Register 
    adminRegister:(adminData)=>{
        return new Promise(async(res,rej)=>{
            let admin_check = await admin_reg_model.findOne({Email:adminData.Email})
            if(admin_check){
                res(false)
            }else{
                adminData.Password = await bcrypt.hash(adminData.Password,10)
                admin_reg_model.create(adminData)
                res(true)
            }
        })
    },
    adminView:()=>{
       return new Promise(async(res,rej)=>{
        let admin_details = await admin_reg_model.find()
        res(admin_details)
       })
    },

    // Admin Block
    adminAllow:(adminData)=>{
        return new Promise(async(res)=>{
        await admin_reg_model.findOneAndUpdate({_id:objectid(adminData)},{$set:{Allow:true}})
        res(true)
        })
    },
    BlockAdmin:(adminData)=>{
        return new Promise(async(res)=>{
            await admin_reg_model.findOneAndUpdate({_id:objectid(adminData)},{$set:{Allow:false}})
            res(true)
            })
    },
    OrderView:()=>{
        return new Promise(async(resolve,reject)=>{
           let orders =  await order_model.find()
            resolve(orders)
        })
    },
    ChangeOrderStatus:(OrderId,Value)=>{
        return new Promise(async(resolve,reject)=>{
            if(Value == 'Order Confirmed'){
                await order_model.updateOne({_id:OrderId},{
                    $set:{
                        OrderStatus: Value
                    }
                })
                resolve(true)
            }
            if(Value == 'Order Processed'){
                await order_model.updateOne({_id:OrderId},{
                    $set:{
                        OrderStatus: Value
                    }
                })
                resolve(true)
            }
            if(Value == 'Shipped'){
                await order_model.updateOne({_id:OrderId},{
                    $set:{
                        OrderStatus: Value
                    }
                })
                resolve(true)
            }
            if(Value == 'Out of delivery'){
                await order_model.updateOne({_id:OrderId},{
                    $set:{
                        OrderStatus: Value
                    }
                })
                resolve(true)
            }
            if(Value == 'Delivered'){
                await order_model.updateOne({_id:OrderId},{
                    $set:{
                        OrderStatus: Value
                    }
                })
                resolve(true)
            }
        })
    },
    CreateCoupon:(CouponData)=>{
        return new Promise(async(resolve,reject)=>{
            let Coupon = {
                CouponName: CouponData.Coupon,
                CouponCode: CouponData.Code,
                Percentage: CouponData.percentage,
                MinAmount: CouponData.Minimum,
                LimitAmount: CouponData.Limit,
                ExpiryDate: CouponData.date
            }
            await coupon_model.create(Coupon)
            resolve(true)
        })
    },
    Dashboard:()=>{
        return new Promise(async(resolve,reject)=>{
           let Orders = await order_model.aggregate([
            {
                $match:{
                    OrderStatus:{$eq:'Delivered'}
                },
            },
            {
                $group:{
                    _id: "",
                    TotalSale:{$sum:'$Total'},
                }
            },
            {
                $project:{
                    _id:0,
                    TotalAmount:'$TotalSale',
                    TotalDelivery : '$TotalCount'
                }
            }
           ])
           resolve(Orders)
        })
    },
    DeleteCoupon:(CouponId)=>{
        return new Promise(async(resolve,reject)=>{
        await coupon_model.deleteOne({_id:CouponId})
        resolve()
        })
    },
    UploadBanner:(Name,Image)=>{
        return new Promise(async(resolve,reject)=>{
            let Banner = {
                BannerName:Name,
                BannerImage:Image
            }
            await BannerModel.create(Banner)
            resolve(true)
        })
    },
    EditBanner:(BannerId)=>{
        return new Promise(async(resolve,reject)=>{
            let banner = await BannerModel.findOne({_id:BannerId})
            resolve(banner)
        })
    },
    EditBannerInsert:(BannerId,Name,Image)=>{
        return new Promise(async(resolve,reject)=>{
            await BannerModel.updateOne({_id:BannerId},{
                $set:{
                    BannerName:Name,
                    BannerImage:Image
                }
            })
            resolve(true)
        })
    },
    HideBanner:(BannerId)=>{
        return new Promise(async(resolve,reject)=>{
            await BannerModel.updateOne({_id:BannerId},{
                $set:{
                    Hide:true
                }
            })
            resolve(true)
        })
    },
    UnHideBanner:(BannerId)=>{
        return new Promise(async(resolve,reject)=>{
            await BannerModel.updateOne({_id:BannerId},{
                $set:{
                    Hide:false
                }
            })
            resolve(true)
        })
    },
    DeleteBanner:(BannerId)=>{
        return new Promise(async(resolve,reject)=>{
            await BannerModel.deleteOne({_id:BannerId})
            resolve()
        })
    },
    OrderDetails:(OrderID)=>{
        return new Promise(async(resolve,reject)=>{
            // Order
            let Order = await order_model.findOne({_id:OrderID})
            // Finding Products 
            let productFind = await order_model.findOne({_id:OrderID}).populate('Products.Product')
            let Products = productFind.Products
            // Finding User
            let User = await user_model.findOne({_id:Order.UserId})
            // Find Address
            let value = Order.Address
            console.log(value,"Original Address Value")
            let Check = await address_model.findOne({})  
            console.log(Check,"Finded")
            resolve({Products,User})
        })
    },
    AllowedAdmins:()=>{
        return new Promise(async(resolve,reject)=>{
            let Admins = await admin_reg_model.find({Allow:true}).limit(5)
            resolve(Admins)
        })
    }

}

