const mongoose=require("mongoose");



const userschema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
        select:false
    },
    Date: {
        type:Date,
        default:Date.now
    },
})
const User=mongoose.model("user", userschema)

module.exports = User