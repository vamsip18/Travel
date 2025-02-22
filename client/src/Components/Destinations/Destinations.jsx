import React, { useState } from 'react';
import './Destinations.scss';

function Destinations({ onLocationSubmit }) {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Fetch location suggestions from Nominatim API
  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${input}&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();

      if (data) {
        const locations = data
          .map((item) => {
            const { address } = item;
            return (
              address.city ||
              address.town ||
              address.village ||
              address.hamlet ||
              item.display_name.split(',')[0]
            );
          })
          .filter((name, index, self) => name && self.indexOf(name) === index);

        setSuggestions(locations);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleLocationChange = (e) => {
    const input = e.target.value;
    setLocation(input);
    fetchSuggestions(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLocationSubmit(location, date, distance); // Pass the location to parent or server
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setSuggestions([]);
  };

  const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

  return (
    <div className="destinations">
      <div className="secTitle">
        <span className="highlightText">EXPLORE NOW</span>
        <h3>Find Your Dream Destination</h3>
      </div>
      <div className="container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="location">
              Location <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={handleLocationChange}
              placeholder="Enter destination"
              required
            />
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="date">Travel Date (Optional)</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={currentDate} // Disable past dates
            />
          </div>
          <div className="form-group">
            <label htmlFor="distance">Distance (Optional)</label>
            <select
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            >
              <option value="">Select distance</option>
              <option value="short">Short Distance</option>
              <option value="medium">Medium Distance</option>
              <option value="long">Long Distance</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Destinations;
