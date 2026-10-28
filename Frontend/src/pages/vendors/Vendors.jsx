import Header from "../../components/layout/Header/Header"
import Navbar from "../../components/layout/Navbar/Navbar";


import Footer from "../../components/layout/Footer/Footer";
import VendorHero from "../../components/vendors/hero/VendorHero";
import FeaturedVendors from "../../components/vendors/feature/FeaturedVendor";
import VendorNomination from "../../components/vendors/nomination/VendorNomination";
// import VendorCategories from "../../components/vendors/category/VendorCategories";
import HowWorks from "../../components/vendors/howworks/HowWorks"
import ImpactScale from "../../components/vendors/scale/ImpactScale";

function Vendors() {
  return (
    <>
      <Navbar />
      <Header/>
      <main> 
        <VendorHero/>
        <FeaturedVendors/>
        <VendorNomination/>
        {/* <VendorCategories/> */}
        <HowWorks/>
        <ImpactScale/>
      </main>

       <Footer />
    </>
  );
}

export default Vendors;