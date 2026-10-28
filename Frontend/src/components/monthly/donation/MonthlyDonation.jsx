import React from "react";
import "./MonthlyDonation.css";

const steps = [
  {
    number: "Step 1",
    icon: "☝",
    title: "Choose a mission",
    description: "of your choice",
    color: "blue",
  },
  {
    number: "Step 2",
    icon: "▣",
    title: "Your donations will",
    description: "automatically be deducted monthly",
    color: "green",
  },
  {
    number: "Step 3",
    icon: "₹",
    title: "Choose the amount",
    description: "you would like to donate every month",
    color: "red",
  },
  {
    number: "Step 4",
    icon: "♟",
    title: "You will receive regular",
    description: "updates about your donations",
    color: "purple",
  },
];

function MonthlyDonation() {
  return (
    <section className="monthly-donation">

      {/* Heading */}
      <div className="donation-header">
        <h1>
          How Can You <span>Donate Monthly?</span>
        </h1>

        <p>
          Monthly Donation Programs empower you to create lasting change
          with consistent support. Your monthly contributions ensure
          ongoing care, stability, and hope for those who need it most,
          making a real difference every single day.
        </p>
      </div>

      {/* Steps */}
      <div className="donation-steps">

        {steps.map((step, index) => (
          <React.Fragment key={step.number}>

            <div className={`donation-step ${step.color}`}>

              {/* Icon */}
              <div className="step-icon">
                <span>{step.icon}</span>
              </div>

              {/* Content */}
              <div className="step-content">

                <div className="step-number">
                  {step.number}
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>

              </div>

            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className={`step-connector connector-${index}`}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

          </React.Fragment>
        ))}

      </div>

    </section>
  );
}

export default MonthlyDonation;