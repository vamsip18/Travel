import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000"; // Change this if deployed

const TouristPlaces = ({ location }) => {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location) {
      fetchTouristPlaces();
    }
  }, [location]);

  const fetchTouristPlaces = async () => {
    try {
      setError("");
      console.log("Fetching tourist places for location:", location);

      const response = await axios.get(`${API_URL}/tourist-places`, {
        params: { location },
      });

      console.log("Received Tourist Places:", response.data);

      if (response.data.length === 0) {
        console.warn("No tourist places found.");
        setError("No tourist places found for this location.");
      }

      setPlaces(response.data);
    } catch (error) {
      console.error("Axios Error:", error);
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data.error}`);
      } else if (error.request) {
        setError("No response from server. Check if the backend is running.");
      } else {
        setError("Error fetching tourist places. Please try again.");
      }
    }
  };

  const navigateToGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Famous Places & Tourist Attractions</h1>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {places.length === 0 && !error && (
        <p style={{ textAlign: "center", fontSize: "16px", color: "gray" }}>
          No tourist places found for the selected location.
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {places.map((place, index) => (
          <div
            key={place.id || index} // Ensured key is unique
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "250px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => navigateToGoogleMaps(place.latitude, place.longitude)}
          >
            <img
              src={place.photo || "https://via.placeholder.com/250x150.png?text=No+Image"}
              alt={place.name}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <h3>{place.name}</h3>
            <p>{place.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TouristPlaces;
