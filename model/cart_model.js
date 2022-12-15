const mongoose = require('mongoose');
const ObjectId = require('objectid');

const Schema = mongoose.Schema 


let Cart_collection = new Schema({
    UserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    Products:[{
        Product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'products',
        },
        Quantity:{
            type:Number
        }
    }]
})


const cartCollection = mongoose.model("Cart_collection",Cart_collection)

module.exports = cartCollection;