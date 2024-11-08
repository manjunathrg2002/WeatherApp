import React, { useState } from "react";

function SearchEngine({ query, setQuery, search, addFavoriteCity, recentSearches }) {
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
        onFocus={() => setShowRecent(true)}
        onBlur={() => setTimeout(() => setShowRecent(false), 200)} // Delay to allow click on dropdown
      />
      <button onClick={(e) => search(e)}>
        <i className="fas fa-search" style={{ fontSize: "18px" }}></i>
      </button>
      <button onClick={addFavoriteCity}>
        <i className="fa-solid fa-plus" style={{ fontSize: "10px" }}> Add to Favorite</i>
      </button>

      {/* Dropdown for recent searches */}
      {showRecent && query && recentSearches.length > 0 && (
        <div className="recent-search-dropdown" style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1,
        }}>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {recentSearches
              .filter((city) => city.toLowerCase().includes(query.toLowerCase())) // Filter based on query
              .map((city, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setQuery(city);
                    search(null, city); // Pass the city to fetch its data
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
