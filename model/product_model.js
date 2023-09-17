const mongoose = require('mongoose')
const { array } = require('../middleware/multer')
const Schema = mongoose.Schema


let Product = new Schema({
    ProductName:{
        type:String,
        require:true
    },
    Image:{
        type:Array
    },
    Discription:{
        type:String,
        require:true
    },
    Price:{
        type:Number,
        require:true
    }, 
    DiscountPrice:{
        type:Number,
        require:true
    },
    Category:{
        type:String,
        require:true
    },
    Allow :{
        type:Boolean,
        default:true
    },
    Trending:{
        type:Boolean,
        default:false
    }
})

const productCollection = mongoose.model("products",Product)

module.exports = productCollection
