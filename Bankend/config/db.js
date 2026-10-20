const mongoose = require("mongoose")

const connectionDB = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB successfully connected")
    } catch(error) {
        console.error("MongoDB connection failed", error.message);
        process.exit(1);
    }

}
module.exports = connectionDB;