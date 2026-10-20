
import "./GetInvolved.css";
import { Link } from "react-router-dom";

const involvementOptions = [
  {
    icon: "♡",
    theme: "coral",
    title: "Become a Volunteer",
    description:
      "Contribute your time and skills to help patients and families navigate their healthcare journey.",
    button: "Join as Volunteer",
    href: "/volunteer",
  },
  {
    icon: "✚",
    theme: "blue",
    title: "Support Patient Care",
    description:
      "Help us spread awareness about healthcare support, patient guidance and available assistance.",
    button: "Explore Our Work",
    href: "/assistance/surgical",
  },
  {
    icon: "✧",
    theme: "purple",
    title: "Partner With Us",
    description:
      "Explore collaboration opportunities with hospitals, healthcare professionals and organisations.",
    button: "Explore Partnership",
    href: "mailto:contact@opositivehealth.org?subject=Partnership%20Enquiry",
  },
];

function GetInvolved() {
  return (
    <section className="get-involved" id="get-involved">
      <div className="get-involved-inner">
        <div className="get-involved-heading">
          <span className="get-involved-label">
            GET INVOLVED
          </span>

          <h2>Every Helping Hand Makes a Difference.</h2>

          <p>
            Give your time, share your skills or collaborate with us
            to help make healthcare journeys easier for patients
            and their families.
          </p>
        </div>

        <div className="involvement-grid">
          {involvementOptions.map((option) => (
            <article
              className={`involvement-card ${option.theme}`}
              key={option.title}
            >
              <div
                className="involvement-icon"
                aria-hidden="true"
              >
                {option.icon}
              </div>

              <h3>{option.title}</h3>

              <p>{option.description}</p>

              {option.href.startsWith("mailto:") ? (
                <a
                  className="involvement-button"
                  href={option.href}
                >
                  {option.button}
                  <span aria-hidden="true"> →</span>
                </a>
              ) : (
                <Link
                  className="involvement-button"
                  to={option.href}
                >
                  {option.button}
                  <span aria-hidden="true"> →</span>
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GetInvolved;
