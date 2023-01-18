const mongoose = require('mongoose');
const ObjectId = require('objectid');

const Schema = mongoose.Schema 


let Wishlist_collection = new Schema({
    UserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
    Products:[{
        Product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'products',
        }
    }]
})


const wishCollection = mongoose.model("Wishist_collection",Wishlist_collection)

module.exports = wishCollection;