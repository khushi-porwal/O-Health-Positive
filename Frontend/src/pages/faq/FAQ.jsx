import React, { useState } from "react";
import "./FAQ.css";
import faq from "../../assets/faq.jpeg";
import Footer from "../../components/layout/Footer/Footer";
import MainHeader from "../../components/layout/Header/Header";
import Navbar from "../../components/layout/Navbar/Navbar"
const faqData = {
  Donors: [
    {
      question: "How can I support a campaign through True Hope Foundation?",
      answer:
        "You can support a verified campaign by choosing the campaign you wish to help and contributing through the available donation options."
    },
    {
      question: "How do I know where my donation is being used?",
      answer:
        "Donations are used according to the purpose of the campaign and the charitable objectives of the Foundation."
    },
    {
      question: "Will I receive updates about my donation?",
      answer:
        "Yes. Where applicable, donors may receive updates regarding the campaign and the impact of their contribution."
    },
    {
      question: "Can I receive a donation receipt?",
      answer:
        "Yes, eligible donations may receive a donation receipt based on the information provided during the donation process."
    }
  ],

  NGOs: [
    {
      question: "How can an NGO start a campaign with True Hope Foundation?",
      answer:
        "NGOs can submit their campaign or partnership requirements through the Foundation. The submitted information may be reviewed before approval."
    },
    {
      question: "What information does an NGO need to provide?",
      answer:
        "The NGO may be required to provide organizational details, registration information, campaign objectives and supporting documents."
    },
    {
      question: "How are NGOs verified?",
      answer:
        "The Foundation may review organizational information and supporting documents before featuring or supporting a campaign."
    },
    {
      question: "Will the Foundation help NGOs with campaigns?",
      answer:
        "Depending on the campaign and available resources, the Foundation may provide appropriate support and coordination."
    }
  ],

  "Medical Campaign": [
    {
      question: "How can I start a medical campaign on the True Hope Foundation?",
      answer:
        "You can submit your medical campaign details through the campaign registration process. Your information and supporting documents may be reviewed before the campaign is approved."
    },
    {
      question:
        "What type of medical treatments or expenses can I raise support for?",
      answer:
        "Support may be requested for eligible medical treatments, surgeries, medicines, hospital expenses and other healthcare-related needs, subject to verification and applicable guidelines."
    },
    {
      question: "How will donors know that my medical case is genuine?",
      answer:
        "Medical campaigns may be reviewed using relevant medical documents, treatment details and other supporting information to help establish the authenticity of the case."
    },
    {
      question: "How will I know when someone supports my medical campaign?",
      answer:
        "Where the platform provides campaign notifications, you may receive an update when a donation or support is received."
    },
    {
      question:
        "What documents do I need to provide to start my medical campaign?",
      answer:
        "Depending on the case, you may need medical reports, prescriptions, hospital documents, identity details, treatment estimates and other relevant supporting documents."
    },
    {
      question:
        "How long can my medical campaign remain active on the platform?",
      answer:
        "The campaign duration may depend on the campaign requirements, available resources and the Foundation's applicable guidelines."
    }
  ]
};

const tabIcons = {
  Donors: "♡",
  NGOs: "♧",
  "Medical Campaign": "⚑"
};

function FAQ() {
  const [activeTab, setActiveTab] = useState("Medical Campaign");
  const [openIndex, setOpenIndex] = useState(null);

  const currentFAQs = faqData[activeTab];

  const changeTab = (tab) => {
    setActiveTab(tab);
    setOpenIndex(null);
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    <MainHeader/>

    <section className="faq-section">
      <div className="faq-container">

        {/* LEFT SIDE */}
        <div className="faq-left">

          <div className="faq-label">
            <span className="faq-label-icon">✣</span>
            FAQ
          </div>

          <h1>
            Frequently Asked
            <span>Questions</span>
          </h1>

          <p className="faq-description">
            Have questions about our work and impact? Find clear
            answers that help you understand how TrueHope
            Foundation makes a difference.
          </p>

          <div className="faq-image-wrapper">
            <img
              src={faq}
              alt="FAQ Illustration"
              className="faq-image"
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="faq-right">

          {/* TABS */}
          <div className="faq-tabs">
            {Object.keys(faqData).map((tab) => (
              <button
                key={tab}
                className={`faq-tab ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => changeTab(tab)}
              >
                <span className="tab-icon">
                  {tabIcons[tab]}
                </span>

                <span>{tab}</span>
              </button>
            ))}
          </div>

          {/* FAQ QUESTIONS */}
          <div className="faq-list">

            {currentFAQs.map((item, index) => (
              <div
                className={`faq-item ${
                  openIndex === index ? "open" : ""
                }`}
                key={index}
              >

                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{item.question}</span>

                  <span
                    className={`faq-arrow ${
                      openIndex === index ? "rotate" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>

                <div
                  className={`faq-answer ${
                    openIndex === index ? "show" : ""
                  }`}
                >
                  <p>{item.answer}</p>
                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
}

export default FAQ;