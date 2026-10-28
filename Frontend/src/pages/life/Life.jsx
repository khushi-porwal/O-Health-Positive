import Header from "../../components/layout/Header/Header"
import Navbar from "../../components/layout/Navbar/Navbar";
import Hero from "../../components/life/Hero/Hero";
import Footer from "../../components/layout/Footer/Footer";
import MedicalEmergency from "../../components/life/emergency/MedicalEmergency";
import MedicalFundraiser from "../../components/life/fund/MedicalFundraiser";
import MedicalCategories from "../../components/life/medical/MedicalCategories";
import CrowdfundingBenefits from "../../components/life/crowd/CrowdfundingBenefits";
import Testimonials from "../../components/home/testinomial/Testimonials";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";


function Life() {
  return (
    <>
      <Navbar />
      <CrowdfundingHeader/>
      <Header/>
      <main>
        <Hero />
        <MedicalEmergency/>
        <MedicalFundraiser/>
        <MedicalCategories/>
        <CrowdfundingBenefits/>
        <Testimonials/>
      </main>

       <Footer />
    </>
  );
}

export default Life;