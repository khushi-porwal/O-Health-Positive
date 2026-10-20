const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, "name is required"],
        trim:true
    },
    email: {
        type:String,
        unique:true,
        required:[true,"email is required"],
        trim:true,
        lowercase: true
    },
    password: {
        type:String,
        required:[true,"password is required"],
        select: false
    },
    role: {
        type:String,
        default:"ADMIN",
        enum:["ADMIN"]
    }
},{timestamps:true},)

module.exports = mongoose.model("Admin",adminSchema);