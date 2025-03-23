import  React,{ useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const TopRestaurants = ({ location }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [savedRestaurants, setSavedRestaurants] = useState(new Set());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const budget = 2;

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    setError("");

    axios
      .get("http://localhost:8000/restaurants", {
        params: { location, budget },
      })
      .then((response) => {
        setRestaurants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location, budget]);

  const navigateToGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const shareRestaurant = (restaurant) => {
    const shareText = `🍽️ Check out "${restaurant.name}" in "${restaurant.location.formatted_address}"
🏠 Address: ${restaurant.location.formatted_address}
🗺 Google Maps: https://www.google.com/maps/search/?api=1&query=${restaurant.geocodes.main.latitude},${restaurant.geocodes.main.longitude}`;

    const shareData = {
      title: restaurant.name,
      text: shareText,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  const toggleSaveRestaurant = async (restaurant) => {
    const userId = 1;
    try {
      if (savedRestaurants.has(restaurant.id)) {
        await axios.post("http://localhost:8000/delete-restaurant", {
          userId,
          restaurantId: restaurant.id,
        });
        setSavedRestaurants((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(restaurant.id);
          return updatedSet;
        });
      } else {
        await axios.post("http://localhost:8000/save-restaurant", {
          userId,
          restaurantId: restaurant.id,
          name: restaurant.name,
          address: restaurant.location.formatted_address,
          photo: restaurant.photo,
          latitude: restaurant.geocodes.main.latitude,
          longitude: restaurant.geocodes.main.longitude,
        });
        setSavedRestaurants((prev) => new Set([...prev, restaurant.id]));
      }
    } catch (error) {
      console.error("Error toggling restaurant save state:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Top Restaurants in {location}</h1>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {!loading && restaurants.length === 0 && !error && (
        <p style={{ textAlign: "center", fontSize: "16px", color: "gray" }}>
          No restaurants available for the selected location.
        </p>
      )}
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
            onClick={() => navigateToGoogleMaps(restaurant.geocodes.main.latitude, restaurant.geocodes.main.longitude)}
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
            <button 
              style={{
                padding: "5px 10px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "5px",
              }}
              onClick={(e) => { e.stopPropagation(); shareRestaurant(restaurant); }}>
              <ShareIcon />
            </button>
            <button 
              style={{
                padding: "5px 10px",
                background: savedRestaurants.has(restaurant.id) ? "gray" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "5px",
              }}
              onClick={(e) => { e.stopPropagation(); toggleSaveRestaurant(restaurant); }}>
              {savedRestaurants.has(restaurant.id) ? <FavoriteIcon style={{ color: "red",border: "none" }} /> : <FavoriteIcon />}
            </button>
      
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRestaurants;
