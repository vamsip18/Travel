import React, { useEffect, useState } from "react";
import axios from "axios";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const LiveEvents = ({ location, date }) => {
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!location || !date) return;
    fetchEvents();
  }, [location, date]);

  const fetchEvents = async () => {
    try {
      setError("");
      const response = await axios.get("http://localhost:8000/live-events", {
        params: { location, date },
      });
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

  const shareEvent = async (event) => {
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`;
    
    let shareText = `🎟 Check out this event: ${event.name}
📍 Location: ${event.venue}, ${event.city}
🗓 Date: ${event.date} ${event.time !== "TBD" ? `at ${event.time}` : ""}
📌 Google Maps: ${googleMapsLink}`;

    if (event.url) {
      shareText += `\n🔗 More Info: ${event.url}`;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: event.name, text: shareText });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Sharing is not supported in this browser. Event details copied to clipboard!");
    }
  };
  

  const toggleSaveEvent = async (event) => {
    const userId = 1; // Replace with actual user ID
    const eventId = event.id;
    try {
      if (savedEvents.has(eventId)) {
        
        await axios.post("http://localhost:8000/delete-event", { userId, eventId });
        setSavedEvents((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(eventId);
          return updatedSet;
        });
      } else {
        await axios.post("http://localhost:8000/save-event", {
          userId,
          eventId:event.id, // Now we always have an ID
          name: event.name || "Unknown Event",
          venue: event.venue || "Unknown Venue",
          city: event.city || "Unknown City",
          country: event.country || "Unknown Country",
          date: event.date || "TBD",
          time: event.time || "TBD",
          latitude: event.latitude || 0,
          longitude: event.longitude || 0,
          image: event.image || "",
          url: event.url || "",
        });
        setSavedEvents((prev) => new Set([...prev, eventId]));
      }
    } catch (error) {
      console.error("Error toggling event save state:", error);
    }
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
              width: "250px",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => navigateToGoogleMaps(event.latitude, event.longitude)}
          >
            <img
              src={event.image || "https://via.placeholder.com/250"}
              alt={event.name}
              style={{ width: "100%", borderRadius: "10px", height: "150px" }}
            />
            <h3>{event.name}</h3>
            <p>{event.venue}</p>
            <p>{event.city}, {event.country}</p>
            <p>{event.date} {event.time !== "TBD" ? `at ${event.time}` : ""}</p>
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
                onClick={(e) => {
                  e.stopPropagation();
                  shareEvent(event);
                }}
              >
              <ShareIcon />
              </button>
              <button
                style={{
                  padding: "5px 10px",
                  background: savedEvents.has(event.id)? "gray" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "5px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveEvent(event);
                }}
              >
                {savedEvents.has(event.id) ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteIcon />}
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveEvents;
