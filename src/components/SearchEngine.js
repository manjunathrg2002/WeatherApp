import React, { useState } from "react";

function SearchEngine({ query, setQuery, search, recentSearches }) {
  const [showRecent, setShowRecent] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search(e);
      setShowRecent(false); // Hide dropdown after search
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setShowRecent(true); // Show recent searches as the user types
  };

  return (
    <div className="SearchEngine" style={{ position: "relative" }}>
      <input
        type="text"
        className="city-search"
        placeholder="Enter city name"
        name="query"
        value={query}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button onClick={search}>
        <i className="fas fa-search" style={{ fontSize: "18px" }}></i>
      </button>

      {/* Dropdown for recent searches */}
      {showRecent && query && recentSearches.length > 0 && (
        <div className="recent-search-dropdown">
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {recentSearches
              .filter((city) => city.toLowerCase().includes(query.toLowerCase())) // Filter based on query
              .map((city, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setQuery(city);
                    search({ type: "click" });
                    setShowRecent(false); // Hide dropdown after selecting a city
                  }}
                  style={{
                    cursor: "pointer",
                    padding: "8px 10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {city}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchEngine;
