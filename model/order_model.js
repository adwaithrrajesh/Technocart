const mongoose = require('mongoose');
const ObjectId = require('objectid');

const Schema = mongoose.Schema 


let Order_Collection = new Schema({
    UserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    Address:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Address',
    },
    Products:[{
        Product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'products',
        },
        Quantity:{
            type:Number,
            default:1
        },
        Subtotal:{
            type:Number
        }
    }],
    Total:{
        type:Number
    },
    PaymentMethod:{ 
        type:String,
    },
    OrderStatus:{
        type:String
    }
})


const orderCollection = mongoose.model("Order_Collection",Order_Collection)

module.exports = orderCollection;