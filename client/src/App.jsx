import './App.css';
import React, { useState } from "react";
import Navbar from './Components/Navbar/Navbar';
import Home from './Components/Home/Home';
import Middle from './Components/Middle/Middle';
import Destinations from './Components/Destinations/Destinations';
import TabSection from './Components/TabSection/TabSection';
import Contactus from './Components/Contactus/Contactus';
import VideoSlider from './Components/Home/Home';

function App() {
  
  const defaultLocation = "Delhi"; // Default location
  const defaultDate = new Date().toISOString().split("T")[0]; // Default to today's date

  const [location, setLocation] = useState("");
  const [date, setDate] = useState(""); // Initialize with default date
  const handleLocationSubmit = (selectedLocation, selectedDate, selectedDistance) => {
    setLocation(selectedLocation);
    setDate(selectedDate || defaultDate);
  };

  return (
    <div>
      <Navbar />
      <VideoSlider />
      <Middle />
      <Destinations onLocationSubmit={setLocation} onDateSubmit={setDate} />

      {/* Tab Section after Destinations */}
      <TabSection location={location || defaultLocation} date={date||defaultDate} />

      <Contactus />
    </div>
  );
}

export default App;