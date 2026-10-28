import React from "react";
import "./VendorCategories.css";
import collect from "../../../assets/collect.png"
const vendorCategories = [
  {
    title: "Street Food",
    image: collect,
    color: "blue",
  },
  {
    title: "Fresh Produce",
    image: collect,
    color: "green",
  },
  {
    title: "Handicrafts",
    image: collect,
    color: "purple",
  },
  {
    title: "Textiles & Fabrics",
    image: collect,
    color: "blue",
  },
];

function VendorCategories() {
  return (
    <section className="vendor-section">

      {/* Heading */}
      <div className="vendor-heading">

        <div className="small-heading">
          <span className="heading-dot"></span>
          VENDORS CATEGORIES
        </div>

        <h2>
          What Products Can You Buy From Our{" "}
          <span>Vendors?</span>
        </h2>

        <p>
          Every vendor has a story. Buy their products and we'll distribute
          them to partner NGOs - empowering the vendor and supporting the
          community.
        </p>

      </div>


      {/* Vendor Cards */}
      <div className="vendor-grid">

        {vendorCategories.map((vendor, index) => (

          <div className="vendor-card" key={index}>

            <div className="vendor-image-wrapper">

              <img
                src={vendor.image}
                alt={vendor.title}
                className="vendor-image"
              />

              <div
                className={`vendor-label ${vendor.color}`}
              >
                {vendor.title}
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default VendorCategories;