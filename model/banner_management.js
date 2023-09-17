const mongoose = require('mongoose')
const Schema = mongoose.Schema 

let banner = new Schema({
    BannerName:{
        type:String
    },
    BannerImage:{
        type: String
    },
    Hide:{
        type: Boolean,
        default:false
    }
})


const BannerCollections = mongoose.model("Banner",banner)

module.exports = BannerCollections;