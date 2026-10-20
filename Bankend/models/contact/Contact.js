const mongoose = require("mongoose");

const ContactModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength:100
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique:true,
        lowercase:true
    },
    phone: {
        type: String,
        trim: true,
        maxLength:10,
        default: "",

    },
    message: {
        type: String,
        required:[true, "Message is required"],
        trim:true,
        maxlength:2000
    },
    subject: {
        type:String,
        required: [true, "Subject is required"],
        trim:true,
        maxlength:150
    },
    status: {
        type:String,
        enum:["Pending", "In Progress", "Resolved"],
        default: "Pending"
    }
},
{
    timestamps:true
});

const Contact = mongoose.model("Contact", ContactModel);

module.exports =  Contact;