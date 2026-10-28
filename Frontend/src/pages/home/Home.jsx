import Header from "../../components/layout/Header/Header"
import Navbar from "../../components/layout/Navbar/Navbar";
import Hero from "../../components/home/Hero/Hero";
import CampaignSection from "../../components/home/campaign/CampaignCategories"
import HowItWorks from "../../components/home/startcom/StartCampaign";
import CausesSection from "../../components/home/impact/OurImpact";
import SuccessStories from "../../components/home/testinomial/Testimonials";
import Footer from "../../components/layout/Footer/Footer";
import OurImpact from "../../components/home/monthly/MonthlyDonation"
import LiveDonations from "../../components/home/live/LiveDonation";
function Home() {
  return (
    <>
      <Navbar />
      <Header/>
      <main>
        <Hero />
        <CampaignSection />
         <OurImpact />
        <HowItWorks />

         <CausesSection />

         <SuccessStories />
         <LiveDonations/>
         
         

         
      </main>

       <Footer />
    </>
  );
}

export default Home;