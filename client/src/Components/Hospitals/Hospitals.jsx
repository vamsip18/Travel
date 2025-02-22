import React, { useEffect, useState } from "react";
import axios from "axios";

const Hospitals = ({ location, type }) => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const budget = 2; // Budget level (1=low, 4=high)
  const serviceType = type || "hospitals"; // Default to hospitals if no type is provided

  useEffect(() => {
    if (!location) return;

    axios
      .get(`http://localhost:8000/${serviceType}`, {
        params: { location, budget },
      })
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching ${serviceType}:`, error);
        setError(`Failed to fetch ${serviceType} data. Please try again later.`);
      });
  }, [location, budget, serviceType]);

  const navigateToGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>
        Top {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} in {location}
      </h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {services.map((service, index) => (
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
                service.geocodes.main.latitude,
                service.geocodes.main.longitude
              )
            }
          >
            <img
              src={service.photo || "https://via.placeholder.com/250x150.png?text=No+Image"}
              alt={service.name}
              style={{ width: "100%", borderRadius: "10px", height: "150px" }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/250x150.png?text=No+Image";
              }}
            />
            <h3>{service.name}</h3>
            <p>{service.location.formatted_address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
