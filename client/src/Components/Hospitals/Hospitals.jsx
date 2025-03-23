import React, { useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const Hospitals = ({ location, type }) => {
  const [services, setServices] = useState([]);
  const [savedHospitals, setSavedHospitals] = useState(new Set());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const budget = 2;
  const serviceType = type || "hospitals";

  useEffect(() => {
    if (!location) return;

    setLoading(true);
    axios
      .get(`http://localhost:8000/${serviceType}`, {
        params: { location, budget },
      })
      .then((response) => {
        setServices(response.data);
        setError("");
      })
      .catch((error) => {
        console.error(`Error fetching ${serviceType}:`, error);
        setError(`Failed to fetch ${serviceType} data. Please try again later.`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location, budget, serviceType]);

  const navigateToGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const shareHospital = (hospital) => {
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${hospital.geocodes.main.latitude},${hospital.geocodes.main.longitude}`;

    let shareText = `🏥 *Check out this hospital:* ${hospital.name}`;

    if (hospital.location?.formatted_address) {
        shareText += `\n🏠 *Address:* ${hospital.location.formatted_address}`;
    }

    shareText += `\n📍 *Google Maps:* ${googleMapsLink}`;

    const shareData = {
        title: hospital.name,
        text: shareText,
    };

    if (navigator.share) {
        navigator.share(shareData).catch((error) => console.error("Error sharing:", error));
    } else {
        navigator.clipboard.writeText(shareText);
        alert("Sharing is not supported in this browser. The details have been copied to your clipboard!");
    }
  };

  const toggleSaveHospital = async (hospital) => {
    const userId = 1;
    try {
      if (savedHospitals.has(hospital.id)) {
        await axios.post("http://localhost:8000/delete-hospital", {
          userId,
          hospitalId: hospital.id,
        });
        setSavedHospitals((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(hospital.id);
          return updatedSet;
        });
      } else {
        await axios.post("http://localhost:8000/save-hospital", {
          userId,
          hospitalId: hospital.id,
          name: hospital.name,
          address: hospital.location.formatted_address,
          photo: hospital.photo,
          latitude: hospital.geocodes.main.latitude,
          longitude: hospital.geocodes.main.longitude,
        });
        setSavedHospitals((prev) => new Set([...prev, hospital.id]));
      }
    } catch (error) {
      console.error("Error toggling hospital save state:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>
        Top {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} in {location}
      </h1>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {!loading && services.length === 0 && !error && (
        <p style={{ textAlign: "center", fontSize: "16px", color: "gray" }}>
          No hospitals available for the selected location.
        </p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {services.map((hospital, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "280px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => navigateToGoogleMaps(hospital.geocodes.main.latitude, hospital.geocodes.main.longitude)}
          >
            <img
              src={hospital.photo || "https://via.placeholder.com/250x150.png?text=No+Image"}
              alt={hospital.name}
              style={{ width: "100%", borderRadius: "10px", height: "150px" }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/250x150.png?text=No+Image";
              }}
            />
            <h3>{hospital.name}</h3>
            <p>{hospital.location.formatted_address}</p>
            <button style={{
                  padding: "5px 10px",
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "5px",
                }}
                onClick={(e) => { e.stopPropagation(); shareHospital(hospital); }}><ShareIcon /></button>
            <button style={{
                  padding: "5px 10px",
                  background: savedHospitals.has(hospital.id) ? "gray" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "5px",
                }}
                onClick={(e) => { e.stopPropagation(); toggleSaveHospital(hospital); }}>
              {savedHospitals.has(hospital.id) ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteIcon />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;

