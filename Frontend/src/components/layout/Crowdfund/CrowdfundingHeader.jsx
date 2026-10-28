
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import "./CrowdfundingHeader.css";
import DonateNowButton from "../../common/donateButton/DonateNowButton";

const CrowdfundingHeader = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="crowdfunding-header">
      <div className="header-left">
        <p className="header-tagline">
          India's Most Trusted Crowdfunding Platform
        </p>

        <DonateNowButton />
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search
            size={19}
            className="search-icon"
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search By Campaign Title Or NGO Name"
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search campaigns or NGO names"
          />
        </div>

        <Link to="/login" className="header-login-btn">
          Login/Signup
        </Link>
      </div>
    </header>
  );
};

export default CrowdfundingHeader;
