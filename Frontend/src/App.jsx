
import { Routes, Route } from "react-router-dom";

import VendorProducts from "./pages/vendorProduct/VendorProducts";
import Home from "./pages/home/Home";
import ManageVendors from "./pages/admin/vendor/ManageVendors";
import Login from "./pages/auth/login/Login";
import Signup from "./pages/auth/signup/Signup";
import Contact from "./pages/contact/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import BlogDetails from "./pages/blogdetails/BlogDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Chatbot from "./components/common/chatbot/Chatbot";
import About from "./pages/about/About";
import Life from "./pages/life/Life";
import Campaign from "./pages/compaign/Campaign";
import Explore from "./pages/explore/Explore";
import Documents from "./pages/documents/Documents";
import Donation from "./pages/monthly/Donation";
import Vendors from "./pages/vendors/Vendors";
import Blog from "./pages/blog/Blog";
import DonationForm from "./pages/donate/DonateForm";
import WhatsAppButton from "./components/whatsAppButton/WhatsAppButton";
import AllMonthlyPrograms from "./pages/AllMonthly/AllMonthlyPrograms";
import FAQ from "./pages/faq/FAQ";
import RefundPolicy from "./pages/refund/RefundPolicy";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/life" element={<Life />} />
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />

        <Route path="/admin/vendors" element={<ManageVendors />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/donation" element={<Donation />} />
        <Route path="/vendor" element={<Vendors />} />
        <Route path="/blog" element={<Blog />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/monthly-programs"
          element={<AllMonthlyPrograms />}
        />

        <Route path="/donate-form" element={<DonationForm />} />
        <Route path="/documents" element={<Documents />} />

        <Route
          path="/vendors/:id/products"
          element={<VendorProducts />}
        />
        <Route path="/refund" element={<RefundPolicy/>} />
        <Route path="/faqs" element={<FAQ />} />
      </Routes>

      <WhatsAppButton />
      <Chatbot />
    </>
  );
}

export default App;
