const mongoose = require('mongoose')

const Schema = mongoose.Schema 


let admin = {
    FirstName:{
        type:String,
        require:true
    },
    LastName:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
        },
    Allow:{
        type:Boolean,
        default:false
    }
}


const adminCollections = mongoose.model("admin_req",admin)

module.exports = adminCollections;