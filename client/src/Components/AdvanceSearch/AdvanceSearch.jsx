import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Search.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdvanceSearch = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`
      );
      const data = await response.json();
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (place) => {
    setQuery(place.display_name);
    setSuggestions([]);
    setSelectedLocation(place);
  };

  const handleSearchSubmit = async () => {
    if (!selectedLocation || !budget) {
      alert("Please provide location, budget, check-in, and check-out dates.");
      return;
    }

    const lat = selectedLocation.lat;
    const lon = selectedLocation.lon;
    const apiKey = "5ae2e3f221c38a28845f05b6"; // Free OpenTripMap API Key
    const radius = 10000; // Radius in meters
    const limit = 20; // Number of results

    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&apikey=${apiKey}&limit=${limit}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Process data and filter by budget
      const filteredPlaces = data.features
        .map((place) => ({
          id: place.properties.xid,
          name: place.properties.name,
          category: place.properties.kinds,
          budget: Math.random() * 1500, // Assign random budget for demonstration
        }))
        .filter((place) => {
          const budgetRange = budget.split(" - ");
          const minBudget = parseInt(budgetRange[0].replace("$", ""));
          const maxBudget =
            budgetRange[1] !== undefined
              ? parseInt(budgetRange[1].replace("$", ""))
              : Infinity;
          return place.budget >= minBudget && place.budget <= maxBudget;
        });

      navigate("/home", {
        state: {
          popularPlaces: filteredPlaces,
          location: selectedLocation.display_name,
          budget,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
    } catch (error) {
      console.error("Error fetching popular places:", error);
    }
  };

  return (
    <>
      <section className="box-search-advance">
        <Container>
          <Row>
            <Col md={12} xs={12}>
              <div className="box-search shadow-sm">
                {/* Location Input */}
                <div className="item-search">
                  <label className="item-search-label">Location</label>
                  <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Enter a location"
                    className="form-control"
                  />
                  {suggestions.length > 0 && (
                    <ul className="location-suggestions">
                      {suggestions.map((place, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(place)}
                        >
                          {place.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Check-in Date */}
                <div className="item-search item-search-2">
                  <label className="item-search-label">Check In</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd, MMMM, yyyy"
                  />
                </div>

                {/* Check-out Date */}
                <div className="item-search item-search-2">
                  <label className="item-search-label">Check Out</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd, MMMM, yyyy"
                  />
                </div>

                {/* Budget */}
                <div className="item-search bd-none">
                  <label className="item-search-label">Budget</label>
                  <select
                    className="form-select"
                    name="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    <option value="">Select Budget</option>
                    <option value="$100 - $200">$100 - $200</option>
                    <option value="$200 - $500">$200 - $500</option>
                    <option value="$500 - $1000">$500 - $1000</option>
                    <option value="Above $1000">Above $1000</option>
                  </select>
                </div>

                {/* Search Button */}
                <div className="item-search bd-none">
                  <Button
                    className="primaryBtn flex-even d-flex justify-content-center"
                    onClick={handleSearchSubmit}
                  >
                    <i className="bi bi-search me-2"></i> Search
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdvanceSearch;
