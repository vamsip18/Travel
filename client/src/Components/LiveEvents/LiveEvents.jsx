import React, { useEffect, useState } from "react";
import axios from "axios";

const LiveEvents = ({ location, date }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!location || !date) return; // Ensure both location and date are provided
    fetchEvents();
  }, [location, date]); // Fetch events when location or date changes

  const fetchEvents = async () => {
    try {
      setError("");
      const response = await axios.get("http://localhost:8000/live-events", {
        params: { location, date },
      });

      if (response.data.length === 0) {
        // setError("No events found for this location and date.");
        console.log("No events found for this location and date.");
      }
      
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to fetch events. Please try again.");
    }
  };

  const navigateToGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Live Events For You</h1>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {events.length === 0 && !error && (
        <p style={{ textAlign: "center", fontSize: "16px", color: "gray" }}>
          No live events available for the selected location and date.
        </p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {events.map((event, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "20%",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => navigateToGoogleMaps(event.latitude, event.longitude)}
          >
            <img
              src={event.image || "https://via.placeholder.com/250"} // Placeholder if no image
              alt={event.name}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <h3>{event.name}</h3>
            <p>{event.venue}</p>
            <p>{event.city}, {event.country}</p>
            <p>{event.date} {event.time !== "TBD" ? `at ${event.time}` : ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveEvents;