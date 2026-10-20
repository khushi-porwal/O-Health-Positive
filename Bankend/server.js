const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet")
const rateLimit = require("express-rate-limit");
const connectionDB = require("./config/db");
const volunteerRoutes = require("./routes/volunteer/VolunteerRoutes");
const adminRoute = require("./routes/admin/adminRoute")
const contactRoute = require("./routes/contact/contactRoute");
dotenv.config();

const app = express();

//Basic security headers
app.use(helmet());

//Allow request from frontend 
app.use(
    cors({
        origin:process.env.CLIENT_URL || "http://localhost:5173",
    })
)
//middleware 
app.use(express.json({limit: "10kb"}));

//Basic request rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
})

app.use("/api", apiLimiter)


//Health check
app.get("/api/health", (req,res) => {
    return res.status(200).json({
        success: true,
        message:"O Positive Health NGO Backend is running"
    })
})

// Add this after app initialization
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "O Positive Health API is running"
  });
});

//routes 
app.use("/api/contact", contactRoute);
app.use("/api/admin", adminRoute)
app.use("/api/volunteers", volunteerRoutes);
//port
const PORT = process.env.PORT;

//App Listen
//connect mongodb as well
const startServer = async () => {
    await connectionDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
