import Header from "../../components/layout/Header/Header"
import Navbar from "../../components/layout/Navbar/Navbar";


import Footer from "../../components/layout/Footer/Footer";
import DonationHero from "../../components/monthly/Hero/DonationHero";
import MonthlyDonation from "../../components/monthly/donation/MonthlyDonation";
import OurImpact from "../../components/home/monthly/MonthlyDonation";
import WhyChooseUs from "../../components/monthly/whychoose/WhyChooseUs";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";

function Donation() {
  return (
    <>
      <Navbar />
      <CrowdfundingHeader/>
      <Header/>
      <main>
        <DonationHero/>
       
         <MonthlyDonation/>
         <OurImpact/>
         <WhyChooseUs/>

         
      </main>

       <Footer />
    </>
  );
}

export default Donation;