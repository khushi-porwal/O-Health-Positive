
import Footer from "../../../components/layout/Footer";
import Navbar from "../../../components/layout/Navbar";
import "./Insurance.css";

const helpCards = [
  {
    title: "Policy & Workflow Guidance",
    text: "Understanding what your policy covers and how the insurance process works.",
    icon: <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />,
  },
  {
    title: "Treatment Approval Support",
    text: "Help with getting treatment approvals from your insurer and the hospital.",
    icon: (
      <>
        <path d="M9 11l3 3 8-8" />
        <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9" />
      </>
    ),
  },
  {
    title: "Claim & Reimbursement Help",
    text: "Support with filing claims and following up on reimbursements.",
    icon: (
      <>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h6" />
      </>
    ),
  },
  {
    title: "Document Checklist",
    text: "A clear list of the papers you need, so nothing gets missed or delayed.",
    icon: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4h6v3H9z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

const steps = [
  {
    title: "Share your policy details",
    text: "Tell us your insurance provider and what you need help with.",
  },
  {
    title: "We guide the paperwork",
    text: "Our team explains each step and helps you prepare the documents.",
  },
  {
    title: "Follow up till it is settled",
    text: "We help you track approvals and reimbursements until they are done.",
  },
];

const checklist = [
  "Insurance card, policy number and a copy of the policy",
  "Patient's ID proof",
  "Doctor's advice, prescriptions and the hospital's treatment estimate",
  "For reimbursement: bills, discharge summary and test reports",
];

export default function InsuranceAssistance() {
 

  return (
    <>
    <Navbar />
    <div className="ia-page">
      <div className="ia-container">
        <div className="ia-top">
         

          <div className="ia-hero">
            <div className="ia-eyebrow">INSURANCE ASSISTANCE</div>
            <h1 className="ia-title">
              Insurance Help,{" "}
              <span className="ia-accent">Without the Confusion</span>
            </h1>
            <p className="ia-lead">
              We guide patients through insurance workflows, treatment approvals
              and reimbursement processes, so you can focus on recovery instead
              of paperwork.
            </p>
          </div>
        </div>

        <section className="ia-section">
          <h2 className="ia-section-title">What We Help With</h2>
          <div className="ia-cards">
            {helpCards.map((card) => (
              <div className="ia-card" key={card.title}>
                <div className="ia-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#14465F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {card.icon}
                  </svg>
                </div>
                <h3 className="ia-card-title">{card.title}</h3>
                <p className="ia-card-text">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ia-section">
          <h2 className="ia-section-title">How It Works</h2>
          <div className="ia-steps">
            {steps.map((step, index) => (
              <div className="ia-step" key={step.title}>
                <div className="ia-step-no">{index + 1}</div>
                <h3 className="ia-step-title">{step.title}</h3>
                <p className="ia-card-text">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ia-box">
          <div className="ia-box-head">
            <h2 className="ia-box-title">Things to Keep Ready</h2>
            <p className="ia-card-text">
              Having these documents ready helps approvals and claims move
              faster.
            </p>
          </div>

          <div className="ia-checklist">
            {checklist.map((item) => (
              <div className="ia-check-item" key={item}>
                <svg
                  className="ia-check-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B85405"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span className="ia-check-text">{item}</span>
              </div>
            ))}
          </div>

          <div className="ia-divider" />

          <div className="ia-reach">
            <h3 className="ia-step-title">Reach Us</h3>
            <p className="ia-card-text">
              Call [PHONE NUMBER] or write to [EMAIL ADDRESS] and our team will
              guide you through the next steps.
            </p>
          </div>
        </section>
      </div>
    </div>
    <Footer/>
    </>
  );
}