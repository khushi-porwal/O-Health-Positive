
import {
  FaStar,
  FaCommentAlt,
  FaCoins,
  FaCircle,
  FaUsers,
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import "./CrowdfundingBenefits.css";

const benefits = [
  {
    id: 1,
    type: "stat",
    value: "1000+",
    label: "Patients Funded",
  },
  {
    id: 2,
    type: "stat",
    value: "24/7",
    label: "Personalized Expert Assistance",
  },
  {
    id: 3,
    type: "stat",
    value: "50+Lakh",
    label: "Donor Community",
  },
  {
    id: 4,
    type: "feature",
    label: "Fast Review of Fundraisers",
    icon: FaCommentAlt,
    extraIcon: FaStar,
  },
  {
    id: 5,
    type: "feature",
    label: "Indian Tax Benefits",
    icon: GiMoneyStack,
  },
  {
    id: 6,
    type: "feature",
    label: "100% Transparency",
    icon: FaCircle,
    extraIcon: FaCircle,
  },
];

function CrowdfundingBenefits() {
  return (
    <section className="crowdfunding-benefits" id="crowdfunding-benefits">
      <header className="crowdfunding-benefits-header">
        <span className="crowdfunding-eyebrow">
          <span className="crowdfunding-dot" />
          BENEFITS OF CROWDFUNDING
        </span>

        <h2>How Can Crowdfunding Help You</h2>

        <p>
          When the cost of medical treatments takes a toll on you
          financially, harness the power of social networks through
          crowdfunding on O Positive Health Foundation. Get tips,
          crowdfunding assistance &amp; receive donations in times
          of medical emergencies.
        </p>
      </header>

      <div className="crowdfunding-benefits-grid">
        {benefits.map((benefit) => {
          if (benefit.type === "stat") {
            return (
              <article
                className="crowdfunding-benefit-item crowdfunding-stat-item"
                key={benefit.id}
              >
                <h3 className="crowdfunding-stat-value">
                  {benefit.value}
                </h3>
                <p>{benefit.label}</p>
              </article>
            );
          }

          const Icon = benefit.icon;
          const ExtraIcon = benefit.extraIcon;

          return (
            <article
              className="crowdfunding-benefit-item crowdfunding-feature-item"
              key={benefit.id}
            >
              <div className={`crowdfunding-feature-icon feature-icon-${benefit.id}`}>
                {benefit.id === 4 ? (
                  <div className="review-icon">
                    <div className="review-stars">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <Icon />
                  </div>
                ) : benefit.id === 5 ? (
                  <div className="tax-icon">
                    <GiMoneyStack />
                    <span>TAX</span>
                  </div>
                ) : (
                  <div className="transparency-icon">
                    <FaCircle className="transparency-circle-one" />
                    <ExtraIcon className="transparency-circle-two" />
                  </div>
                )}
              </div>

              <p>{benefit.label}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default CrowdfundingBenefits;
