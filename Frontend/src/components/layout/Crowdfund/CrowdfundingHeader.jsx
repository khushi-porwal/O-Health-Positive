
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./CrowdfundingHeader.css";

const CrowdfundingHeader = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  const handleDonate = () => {
    navigate("/donate");
  };

  return (
    <header className="crowdfunding-header">
      <div className="header-left">
        <p className="header-tagline">
          India's Most Trusted Crowdfunding Platform
        </p>

        <button
          className="header-donate-btn"
          onClick={handleDonate}
        >
          Donate Now
        </button>
      </div>

      <div className="header-right">
        <div className="header-search">
          <Search size={19} className="search-icon" />

          <input
            type="search"
            placeholder="Search By Campaign Title Or NGO Name"
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search campaigns or NGO names"
          />
        </div>

        <Link
          to="/login"
          className="header-login-btn"
        >
          Login/Signup
        </Link>
      </div>
    </header>
  );
};

export default CrowdfundingHeader;
