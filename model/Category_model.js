const mongoose = require('mongoose')
const Schema = mongoose.Schema


let Category = new Schema({
    CategoryName:{
        type:String,
        require:true
    }
})

const CategoryCollection = mongoose.model("Category",Category)

module.exports = CategoryCollection
