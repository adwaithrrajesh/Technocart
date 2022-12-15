const mongoose = require('mongoose')

const Schema = mongoose.Schema


let user = new Schema({
    Firstname:{
        type:String,
        require:true
    },
    Lastname:{
        type:String,
        require:true
    },
    PhoneNumber:{
        type:Number,
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
    block:{
        type:Boolean,
        default:false
    }

})

const userCollection = mongoose.model("users",user)

module.exports = userCollection
