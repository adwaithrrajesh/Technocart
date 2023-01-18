const mongoose = require('mongoose')

const Schema = mongoose.Schema 


let address = {
    UserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    Address:[{
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
        PhoneNumber:{
            type: Number,
            require:true
        },
        CompanyName:{
            type:String
        },
        CompanyAddress:{
            type:String
        },
        Country:{
            type:String,
            require:true
        },
        Address:{
            type:String,
            require:true
        },
        City:{
            type:String,
            require:true
        },
        State:{
            type:String,
            require:true
        },
        PinCode:{
            type:Number,
            require:true
        }
    }]
}
const addressCollections = mongoose.model("Address",address)

module.exports = addressCollections;