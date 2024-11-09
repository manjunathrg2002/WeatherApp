import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";
import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [query, setQuery] = useState("Bangalore");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );

  // Initialize favorite cities from JSON server
  useEffect(() => {
    const fetchFavoriteCities = async () => {
      try {
        const res = await axios.get("http://localhost:3001/favoriteCities");
        setFavoriteCities(res.data);
      } catch (error) {
        console.error("Error fetching favorite cities:", error);
      }
    };
    fetchFavoriteCities();
  }, []);

  // Search function
  const search = async (event, city) => {
    if (event) event.preventDefault();
    const searchCity = city || query;
    setWeather({ ...weather, loading: true });
    const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
    const url = `https://api.shecodes.io/weather/v1/current?query=${searchCity}&key=${apiKey}`;

    try {
      const res = await axios.get(url);
      setWeather({ data: res.data, loading: false, error: false });

      // Update recent searches
      if (!recentSearches.includes(searchCity)) {
        const updatedRecentSearches = [searchCity, ...recentSearches].slice(0, 5);
        setRecentSearches(updatedRecentSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedRecentSearches));
      }
    } catch (error) {
      setWeather({ ...weather, data: {}, error: true });
      console.log("error", error);
    }
  };

  // Trigger an initial search for the default city
  useEffect(() => {
    search();
  }, []);

  const addFavoriteCity = async () => {
    if (query && !favoriteCities.some(city => city.name === query)) {
      try {
        const res = await axios.post("http://localhost:3001/favoriteCities", { name: query });
        setFavoriteCities([...favoriteCities, res.data]);
      } catch (error) {
        console.error("Error adding favorite city:", error);
      }
    }
  };

  const removeFavoriteCity = async (city) => {
    const cityToDelete = favoriteCities.find(favCity => favCity.name === city);
    if (cityToDelete) {
      try {
        await axios.delete(`http://localhost:3001/favoriteCities/${cityToDelete.id}`);
        setFavoriteCities(favoriteCities.filter(favCity => favCity.name !== city));
      } catch (error) {
        console.error("Error removing favorite city:", error);
      }
    }
  };

  return (
    <div className="App">
      <div className="favorites">
        <h3>Favorite Cities:</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {favoriteCities.map((city) => (
            <li
              key={city.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "10px",
              }}
            >
              <span
                onClick={() => {
                  setQuery(city.name);
                  search(null, city.name);
                }}
                style={{ cursor: "pointer" }}
              >
                {city.name}
              </span>
              <button onClick={() => removeFavoriteCity(city.name)}>
                <i className="fa-solid fa-trash" style={{ fontSize: "18px" }}></i>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <SearchEngine
        query={query}
        setQuery={setQuery}
        search={search}
        addFavoriteCity={addFavoriteCity}
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
              Sorry, city not found. Please try again.
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
