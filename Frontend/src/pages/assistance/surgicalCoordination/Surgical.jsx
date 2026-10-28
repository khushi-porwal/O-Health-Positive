
// import "./Surgical.css";
// import Navbar from "../../../components/layout/Navbar";
// import Footer from "../../../components/layout/Footer";
// const helpCards = [
//   {
//     title: "Hospital Coordination",
//     text: "Connecting you with the right hospital and guiding you through its admission process.",
//     icon: (
//       <>
//         <path d="M3 21h18" />
//         <path d="M5 21V7l7-4 7 4v14" />
//         <path d="M12 9v6" />
//         <path d="M9 12h6" />
//       </>
//     ),
//   },
//   {
//     title: "Surgeon & Appointment Support",
//     text: "Help with booking consultations, second opinions and follow-up visits.",
//     icon: (
//       <>
//         <rect x="3" y="5" width="18" height="16" rx="2" />
//         <path d="M3 10h18" />
//         <path d="M8 3v4" />
//         <path d="M16 3v4" />
//       </>
//     ),
//   },
//   {
//     title: "Planned Surgery Guidance",
//     text: "Step-by-step support before, during and after a scheduled surgery.",
//     icon: (
//       <>
//         <path d="M9 11l3 3 8-8" />
//         <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h9" />
//       </>
//     ),
//   },
//   {
//     title: "Emergency Surgical Care",
//     text: "Quick coordination when surgery cannot wait.",
//     icon: (
//       <>
//         <circle cx="12" cy="12" r="9" />
//         <path d="M12 7v5l3 2" />
//       </>
//     ),
//   },
// ];

// const steps = [
//   {
//     title: "Tell us what you need",
//     text: "Share the patient's details and the surgery or hospital help you are looking for.",
//   },
//   {
//     title: "We coordinate",
//     text: "Our team reaches out to the hospital and helps arrange the next steps.",
//   },
//   {
//     title: "Stay supported",
//     text: "We stay with you through admission, the procedure and discharge.",
//   },
// ];

// const checklist = [
//   "Patient's ID proof and basic details",
//   "Doctor's advice, prescriptions and previous medical reports",
//   "Test and scan reports related to the surgery",
//   "Insurance card or policy details, if available",
// ];

// export default function SurgicalCoordination() {
  

//   return (
//     <>
//     <Navbar/>

//     <div className="sc-page">
//       <div className="sc-container">
//         <div className="sc-top">

//           <div className="sc-hero">
//             <div className="sc-eyebrow">SURGICAL COORDINATION</div>
//             <h1 className="sc-title">
//               Surgery Support,{" "}
//               <span className="sc-accent">Handled With Care</span>
//             </h1>
//             <p className="sc-lead">
//               From finding the right hospital to planning the day of surgery, we
//               help patients and families coordinate planned or emergency
//               surgical care with clarity and support.
//             </p>
//           </div>
//         </div>

//         <section className="sc-section">
//           <h2 className="sc-section-title">What We Help With</h2>
//           <div className="sc-cards">
//             {helpCards.map((card) => (
//               <div className="sc-card" key={card.title}>
//                 <div className="sc-icon">
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#14465F"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     aria-hidden="true"
//                   >
//                     {card.icon}
//                   </svg>
//                 </div>
//                 <h3 className="sc-card-title">{card.title}</h3>
//                 <p className="sc-card-text">{card.text}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="sc-section">
//           <h2 className="sc-section-title">How It Works</h2>
//           <div className="sc-steps">
//             {steps.map((step, index) => (
//               <div className="sc-step" key={step.title}>
//                 <div className="sc-step-no">{index + 1}</div>
//                 <h3 className="sc-step-title">{step.title}</h3>
//                 <p className="sc-card-text">{step.text}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="sc-box">
//           <div className="sc-box-head">
//             <h2 className="sc-box-title">Things to Keep Ready</h2>
//             <p className="sc-card-text">
//               Having these with you helps us coordinate faster and avoid delays
//               at the hospital.
//             </p>
//           </div>

//           <div className="sc-checklist">
//             {checklist.map((item) => (
//               <div className="sc-check-item" key={item}>
//                 <svg
//                   className="sc-check-icon"
//                   width="22"
//                   height="22"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#B85405"
//                   strokeWidth="2.4"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   aria-hidden="true"
//                 >
//                   <path d="M20 6 9 17l-5-5" />
//                 </svg>
//                 <span className="sc-check-text">{item}</span>
//               </div>
//             ))}
//           </div>

//           <div className="sc-divider" />

//           <div className="sc-reach">
//             <h3 className="sc-step-title">Reach Us</h3>
//             <p className="sc-card-text">
//               Call [PHONE NUMBER] or write to [EMAIL ADDRESS]. In an emergency,
//               please go to the nearest hospital right away.
//             </p>
//           </div>
//         </section>
//       </div>
//     </div>

//     <Footer/>
//     </>
//   );
// }