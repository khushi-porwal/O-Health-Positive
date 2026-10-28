
import {
  FaHeart,
  FaRibbon,
  FaQuestionCircle,
  FaBaby,
} from "react-icons/fa";
import { GiKidneys, GiBoneGnawer } from "react-icons/gi";

import "./MedicalCategories.css";

const categories = [
  {
    id: 1,
    title: "Open Heart Surgery",
    icon: FaHeart,
  },
  {
    id: 2,
    title: "Kidney Transplant",
    icon: GiKidneys,
  },
  {
    id: 3,
    title: "NICU Care",
    icon: FaBaby,
  },
  {
    id: 4,
    title: "Bone Marrow Transplant",
    icon: GiBoneGnawer,
  },
  {
    id: 5,
    title: "Cancer Treatment",
    icon: FaRibbon,
  },
  {
    id: 6,
    title: "Any Other Disease?",
    icon: FaQuestionCircle,
  },
];

function MedicalCategories() {
  const handleCategoryClick = (category) => {
    // Update this URL to your actual fundraiser form route.
    window.location.href = `/start-fundraiser?category=${encodeURIComponent(
      category.title
    )}`;
  };

  return (
    <section className="medical-categories-section">
      <div className="medical-categories-heading">
        <span className="medical-categories-eyebrow">
          <span className="medical-categories-dot" />
          MEDICAL FUNDRAISING CATEGORIES
        </span>

        <h2>What Medical Treatments Can You Raise Funds For?</h2>
      </div>

      <div className="medical-categories-grid">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              type="button"
              className="medical-category-card"
              key={category.id}
              onClick={() => handleCategoryClick(category)}
            >
              <Icon
                className="medical-category-icon"
                aria-hidden="true"
              />

              <span className="medical-category-title">
                {category.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default MedicalCategories;
