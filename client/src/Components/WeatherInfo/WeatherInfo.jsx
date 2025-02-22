import React, { useState } from "react";
import axios from "axios";

const WeatherInfo = () => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    try {
      setError(null);
      const response = await axios.get("http://localhost:8000/weather", {
        params: { location, date },
      });
      setWeather(response.data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Weather Information</h1>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: "10px", margin: "5px" }}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ padding: "10px", margin: "5px" }}
      />
      <button onClick={fetchWeather} style={{ padding: "10px 20px", margin: "10px" }}>
        Get Weather
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", marginTop: "20px" }}>
          <h2>{weather.location}</h2>
          <p><strong>Date:</strong> {weather.requested_date}</p>
          <p><strong>Temperature:</strong> {weather.temperature}°C</p>
          <p><strong>Condition:</strong> {weather.description}</p>
          <p><strong>Humidity:</strong> {weather.humidity}%</p>
          <p><strong>Wind Speed:</strong> {weather.wind_speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;
