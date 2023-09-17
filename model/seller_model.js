const mongoose = require('mongoose')
const Schema = mongoose.Schema 


let seller = {
    FullName:{
        type:String
    },
    Email:{
        type:String
    },
    PhoneNumber:{
        type:Number
    },
    Password:{
        type:String
    }
}


const sellerCollections = mongoose.model("seller",seller)

module.exports = sellerCollections;