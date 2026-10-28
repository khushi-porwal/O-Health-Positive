import Header from "../../components/layout/Header/Header"
import Navbar from "../../components/layout/Navbar/Navbar";

import Footer from "../../components/layout/Footer/Footer";

import CampaignBanner from "../../components/explore/Hero/CampaignBanner";
import DonationHero from "../../components/explore/donation/Campaigns";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";

function Explore() {
  return (
    <>
      <Navbar />
      <CrowdfundingHeader/>
      <Header/>
      <main>
        <CampaignBanner/>
        <DonationHero/>
      </main>

       <Footer />
    </>
  );
}

export default Explore;