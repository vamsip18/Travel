import React, { useState } from "react";
import TopRestaurants from "../TopRestaurants/Restaurants";
import TouristPlaces from "../TouristPlaces/TouristPlaces";
import LiveEvents from "../LiveEvents/LiveEvents";
import Hospitals from "../Hospitals/Hospitals";
import WeatherInfo from "../WeatherInfo/WeatherInfo";
import "./TabSection.css";

const TabSection = ({ location, date }) => {
  const [activeTab, setActiveTab] = useState("TouristPlaces"); // Default is Famous Places

  return (
    <div className="tab-container">
      {/* Tab Navigation */}
      <div className="tabs">
        {["TouristPlaces", "Restaurants", "Live Events", "Hospitals", "Weather Info"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "TouristPlaces" && <TouristPlaces location={location} />}
        {activeTab === "Restaurants" && <TopRestaurants location={location} />}
        {activeTab === "Live Events" && <LiveEvents location={location} date={date} />}
        {activeTab === "Hospitals" && <Hospitals location={location} />}
        {activeTab === "Weather Info" && <WeatherInfo location={location} />}
      </div>
    </div>
  );
};

export default TabSection;
