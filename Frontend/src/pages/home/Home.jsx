
import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import CampaignSection from "../../components/home/CampaignSection"
import HowItWorks from "../../components/home/HowItWorks";
import CausesSection from "../../components/home/CausesSection";
import SuccessStories from "../../components/home/SuccessStories";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Footer from "../../components/layout/Footer";
import GetInvolved from "../../components/home/GetInvolved";
import OurImpact from "../../components/home/OurImpact"
import DonateSection from "../../components/home/DonateSection";
function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <CampaignSection />
         <OurImpact />
        <HowItWorks />

         <CausesSection />

         <SuccessStories />
          <GetInvolved/>
         <WhyChooseUs />

         <DonateSection/>
      </main>

       <Footer />
    </>
  );
}

export default Home;