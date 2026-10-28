const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});
const { verifyEmailConnection } = require("./utils/sendEmail");




console.log(
  "Gemini API key loaded:",
  Boolean(process.env.GEMINI_API_KEY)
);

console.log("SMTP credentials check:", {
  emailExists: Boolean(process.env.SMTP_EMAIL?.trim()),
  passwordExists: Boolean(process.env.SMTP_APP_PASSWORD?.trim()),
  passwordLength: process.env.SMTP_APP_PASSWORD
    ?.replace(/\s/g, "").length,
});

const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth/authRoutes");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectionDB = require("./config/db");
const vendorRoutes = require("./routes/vendor/vendorRoutes");
const volunteerRoutes = require("./routes/volunteer/VolunteerRoutes");
const adminRoute = require("./routes/admin/adminRoute");
const campaignRoutes = require("./routes/campaign/campaignRoutes")
const contactRoute = require("./routes/contact/contactRoute");
const chatbotRoutes = require("./routes/chatbot/chatbotRoutes");
const donationRoutes = require("./routes/donate/donationRoutes");
const blogRoutes = require("./routes/blog/BlogRoutes")
const monthlyDonation = require("./routes/monthly/monthlyRoutes")
const app = express()

//Allow request from frontend 
const allowedOrigins = [
  
  "https://o-health-positive-x3ej-seven.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

//middleware 
app.use(express.json({limit: "10kb"}));
app.use(cookieParser());

//Basic request rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
})

app.use("/api", apiLimiter)
verifyEmailConnection();

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
app.use("/api", monthlyDonation)
app.use("/api/contact", contactRoute);
app.use("/api/admin", adminRoute)
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
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
