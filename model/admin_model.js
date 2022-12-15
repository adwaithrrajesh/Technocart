const mongoose = require('mongoose')

const Schema = mongoose.Schema 


let admin = {
    
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
        }
}


const adminCollection = mongoose.model("admin",admin)

module.exports = adminCollection;