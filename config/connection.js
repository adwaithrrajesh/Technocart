const mongoose = require('mongoose')
const url = 'mongodb+srv://Technocart:1234@cluster0.nm1zgko.mongodb.net/cluster0?retryWrites=true&w=majority'
module.exports = async function connection(){
    try{

        mongoose.connect(
            url,
            (err, data) => {
                if (err)
                    return new Error('Unable to connect to the database')
                console.log('Database connected successfully')
            }
        )
    }
    catch(err){
        console.log(err)
    }
}