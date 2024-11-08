import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";
import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [query, setQuery] = useState("Bangalore"); // Set default city as Bangalore
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });
  const [favoriteCities, setFavoriteCities] = useState(
    JSON.parse(localStorage.getItem("favoriteCities")) || []
  );
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );

  // Search function
  const search = async (event) => {
    if (event) event.preventDefault();

    setWeather({ ...weather, loading: true });
    const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
    const url = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`;

    try {
      const res = await axios.get(url);
      setWeather({ data: res.data, loading: false, error: false });

      // Update recent searches
      if (!recentSearches.includes(query)) {
        const updatedRecentSearches = [query, ...recentSearches].slice(0, 5); // Keep only the last 5 searches
        setRecentSearches(updatedRecentSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));
      }
    } catch (error) {
      setWeather({ ...weather, data: {}, error: true });
      console.log("error", error);
    }
  };

  // Trigger an initial search for the default city (Bangalore)
  useEffect(() => {
    search();
  }, []);

  return (
    <div className="App">
      <div className="favorites">
        <h3>Favorite Cities:</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {favoriteCities.map((city, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px",
              }}
            >
              <span
                onClick={() => {
                  setQuery(city);
                  search();
                }}
                style={{ cursor: "pointer" }}
              >
                {city}
              </span>
              <button onClick={() => removeFavoriteCity(city)}>
                <i className="fa-solid fa-trash" style={{ fontSize: "18px" }}></i>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Pass recent searches to SearchEngine */}
      <SearchEngine
        query={query}
        setQuery={setQuery}
        search={search}
        recentSearches={recentSearches}
      />

      {weather.loading && (
        <>
          <br />
          <br />
          <h4>Searching..</h4>
        </>
      )}
      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <span style={{ fontFamily: "font" }}>
              Sorry city not found, please try again.
            </span>
          </span>
        </>
      )}
      {weather && weather.data && weather.data.condition && (
        <Forecast weather={weather} />
      )}
    </div>
  );
}

export default App;
