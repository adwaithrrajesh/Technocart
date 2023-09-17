const mongoose = require('mongoose')
const Schema = mongoose.Schema 


let coupon = {
    CouponName:{
        type:String,
        require:true
    },
    CouponCode:{
        type:String,
        require:true
    },
    Percentage:{
        type:Number,
        require:true
    },
    MinAmount:{
        type:Number,
        require:true
    },
    LimitAmount:{
        type:Number,
        require:true
    },
    ExpiryDate :{
        type:Date,
        require:true
    }
}


const couponCollections = mongoose.model("coupon",coupon)

module.exports = couponCollections;