
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./CrowdfundingHeader.css";
import DonateNowButton from "../../common/donateButton/DonateNowButton";

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchTerm.trim();

    if (query) {
      navigate(`/explore?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/explore");
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
        <form
          className="header-search"
          onSubmit={handleSearchSubmit}
          role="search"
        >
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
        </form>

        <Link to="/login" className="header-login-btn">
          Login/Signup
        </Link>
      </div>
    </header>
  );
};

export default CrowdfundingHeader;
