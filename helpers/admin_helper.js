const mongoose = require('../config/connection')
const bcrypt = require('bcrypt')
const admin_model = require('../model/admin_model')
const user_model = require('../model/User_model')
const admin_reg_model = require('../model/admin_reg_model')
const { response } = require('express')
const objectid = require('mongoose').Types.ObjectId



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
                        console.log('Login Failed')
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
                            console.log('Login Failed')
                        }
                    })
                }else{
                    console.log("Request pending")
                }
            }
            else{
                console.log('Login Failed')
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
        return new Promise(async()=>{
        await admin_reg_model.findOneAndUpdate({_id:objectid(adminData)},{$set:{Allow:true}})
        })
    },
    BlockAdmin:(adminData)=>{
        return new Promise(async()=>{
            await admin_reg_model.findOneAndUpdate({_id:objectid(adminData)},{$set:{Allow:false}})
            })
    }

}

