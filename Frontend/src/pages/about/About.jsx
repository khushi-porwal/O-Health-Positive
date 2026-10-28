import Header from "../../components/layout/Header/Header"
import Navbar from "../../components/layout/Navbar/Navbar";
import Hero from "../../components/about/Hero/Hero";

import Footer from "../../components/layout/Footer/Footer";
import WhoWeAre from "../../components/about/whoWe/WhoWeAre";
import OurVision from "../../components/about/vision/OurVision";
import Mission from "../../components/about/mission/Mission";
import OurStrength from "../../components/about/strength/OurStrength";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";

function Home() {
  return (
    <>
      <Navbar />
      <CrowdfundingHeader/>
      <Header/>
      <main>
        <Hero />  
        <WhoWeAre/> 
        <OurVision/> 
        <Mission/>
        <OurStrength/>
      </main>

       <Footer />
    </>
  );
}

export default Home;