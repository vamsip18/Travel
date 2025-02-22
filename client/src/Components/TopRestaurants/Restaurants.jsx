import React, { useEffect, useState } from "react";
import axios from "axios";

const TopRestaurants = ({ location }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState("");
  const budget = 2; // Budget level (1=low, 4=high)

  useEffect(() => {
    if (!location) return;

    axios
      .get("http://localhost:8000/restaurants", {
        params: { location, budget },
      })
      .then((response) => {
        setRestaurants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setError("Failed to fetch restaurant data. Please try again later.");
      });
  }, [location, budget]);

  const navigateToGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Top Restaurants in {location}</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {restaurants.map((restaurant, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "250px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() =>
              navigateToGoogleMaps(
                restaurant.geocodes.main.latitude,
                restaurant.geocodes.main.longitude
              )
            }
          >
            <img
              src={restaurant.photo || "https://via.placeholder.com/250x150.png?text=No+Image"}
              alt={restaurant.name}
              style={{ width: "100%", borderRadius: "10px", height: "150px" }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/250x150.png?text=No+Image";
              }}
            />
            <h3>{restaurant.name}</h3>
            <p>{restaurant.location.formatted_address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRestaurants;