
import "./CampaignBanner.css";
import banner from "../../../assets/banner.png";

function CampaignBanner() {
  return (
    <section className="campaign-banner">
      <div className="banner-container">
        <img
          src={banner}
          alt="Explore Campaigns - O Positive Health Foundation"
        />
      </div>
    </section>
  );
}

export default CampaignBanner;
