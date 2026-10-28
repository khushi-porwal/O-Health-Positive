import Header from "../../components/layout/Header/Header"
import Navbar from "../../components/layout/Navbar/Navbar";

import Footer from "../../components/layout/Footer/Footer";

import CampaignBanner from "../../components/explore/Hero/CampaignBanner";
import DonationHero from "../../components/explore/donation/Campaigns";

function Explore() {
  return (
    <>
      <Navbar />
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