import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Contact from "./pages/contact/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import Volunteer from "./pages/volunteer/Volunteer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Insurance from "./pages/assistance/insuranceAssistance/Insurance";
import Surgical from "./pages/assistance/surgicalCoordination/Surgical";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/assistance/surgical" element={<Surgical />} />
        <Route path="/assistance/insurance" element={<Insurance />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/volunteer" element={<Volunteer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
