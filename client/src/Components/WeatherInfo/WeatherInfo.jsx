import React, { useState, useEffect } from "react";
import "./WeatherInfo.css";
import { API_KEY } from "./config";

const WeatherInfo = ({ location, date }) => {
  // const  API_KEY=process.env.OPENWEATHERMAP_API_KEY;
  const [error, setError] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date(date).getDay();

  useEffect(() => {
    if (location && date) {
      fetchWeatherData(location, date);
    }
  }, [location, date]);

  // ✅ Fetch weather data by city name and date
  const fetchWeatherData = async (city, date) => {
    try {
      setError(false);
      // Fetch current weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        console.error("City not found or invalid date!");
        setError(true);
        return;
      }

      setWeatherData(data);

      // ✅ Fetch forecast for the next 4 days from the given date
      fetchForecastData(data.coord.lat, data.coord.lon, date);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(true);
    }
  };

  // ✅ Fetch 4-day forecast data starting from the given date
  const fetchForecastData = async (lat, lon, date) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      // ✅ Filter forecast data based on the given date
      const targetDate = new Date(date).toISOString().split("T")[0];
      const filteredData = data.list.filter((item) => {
        const itemDate = item.dt_txt.split(" ")[0];
        return itemDate >= targetDate; // Include forecast from the selected date onwards
      });

      // ✅ Get only the next 4 unique days from the filtered forecast
      const uniqueDays = [];
      const next4DaysData = filteredData.filter((item) => {
        const itemDate = new Date(item.dt_txt).getDate();
        if (!uniqueDays.includes(itemDate)) {
          uniqueDays.push(itemDate);
          return true;
        }
        return false;
      });

      // ✅ Show the next 4 days after the selected date
      setForecastData(next4DaysData.slice(1, 5)); // Get the next 4 days forecast
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      setError(true);
    }
  };

  return (
    <>
      {location && <h1>Weather Information for {location}</h1>}
      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          Error fetching weather data. Please provide a valid location or date.
        </p>
      )}
      {!error && weatherData && (
        <div className="WeatherInfo">
          <div className="ForecastBox">
            <div className="left-section">
              <h2 className="day">{dayName}</h2>
              <span className="date">{formattedDate}</span>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                alt="weather-icon"
                className="weather-icon"
              />
              <h2 className="temp">{Math.round(weatherData.main.temp)}°C</h2>
              <h3 className="cloud">{weatherData.weather[0].description}</h3>
            </div>

            <div className="right-section">
              <div className="info-box">
                <span className="label">City</span>
                <span className="value">{weatherData.name}</span>
              </div>
              <div className="info-box">
                <span className="label">Temperature</span>
                <span className="value">{Math.round(weatherData.main.temp)}°C</span>
              </div>
              <div className="info-box">
                <span className="label">Humidity</span>
                <span className="value">{weatherData.main.humidity}%</span>
              </div>
              <div className="info-box">
                <span className="label">Wind Speed</span>
                <span className="value">{weatherData.wind.speed} Km/h</span>
              </div>

              {/* ✅ Forecast Section */}
              <div className="forecast-box">
                {forecastData.map((item, index) => {
                  const day = new Date(item.dt_txt).getDay();

                  return (
                    <div
                      key={index}
                      className={`forecast-item ${
                        day === todayIndex ? "active" : ""
                      }`}
                    >
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt="weather"
                      />
                      <span className="forecast-day">{days[day]}</span>
                      <p className="forecast-temp">
                        {Math.round(item.main.temp)}°C
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherInfo;
