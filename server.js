const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

// Helper function to get coordinates based on location
const getCoordinates = async (location) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        location
      )}&format=json&limit=1`
    );
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: lat, longitude: lon };
    }
    throw new Error("No coordinates found for the given location.");
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw error;
  }
};

// Function to fetch images from Unsplash based on location type
const fetchImageFromUnsplash = async (query) => {
  try {
    const unsplashAPI = "https://api.unsplash.com/photos/random";
    const headers = {
      Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`, // Replace with your Unsplash API key
    };
    const response = await axios.get(unsplashAPI, {
      headers,
      params: {
        query: query,
        orientation: "landscape",
      },
    });

    if (response.data.urls) {
      return response.data.urls.small;
    } else {
      return "https://via.placeholder.com/250x150.png?text=No+Image"; // Fallback placeholder
    }
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error.message);
    return "https://via.placeholder.com/250x150.png?text=No+Image"; // Fallback placeholder
  }
};

// Helper function to fetch data from Foursquare based on query type (hospital, clinic, pharmacy)
const fetchPlaces = async (location, query) => {
  const { latitude, longitude } = await getCoordinates(location);

  const foursquareAPI = "https://api.foursquare.com/v3/places/search";
  const headers = {
    Accept: "application/json",
    Authorization: process.env.FOURSQUARE_API_KEY,
  };

  try {
    const response = await axios.get(foursquareAPI, {
      headers,
      params: {
        ll: `${latitude},${longitude}`,
        query: query,
        radius: 5000, // Search within 5km
        limit: 10,
      },
    });

    const places = response.data.results;

    // Add fallback image from Unsplash if no Foursquare photo found
    const placesWithImages = await Promise.all(
      places.map(async (place) => {
        let photo = "https://via.placeholder.com/250x150.png?text=No+Image"; // Default image
        try {
          const photoResponse = await axios.get(
            `https://api.foursquare.com/v3/places/${place.fsq_id}/photos`,
            { headers }
          );
          const photos = photoResponse.data;
          if (photos.length > 0) {
            photo = `${photos[0].prefix}original${photos[0].suffix}`;
          } else {
            // Fetch an image from Unsplash if no Foursquare image is found
            photo = await fetchImageFromUnsplash(query);
          }
        } catch (error) {
          console.error("Error fetching Foursquare photo:", error.message);
          // Fetch an image from Unsplash if Foursquare API fails
          photo = await fetchImageFromUnsplash(query);
        }

        return {
          id: place.fsq_id,
          name: place.name,
          location: place.location,
          geocodes: place.geocodes,
          photo, // Add the photo URL (from Foursquare or Unsplash)
        };
      })
    );

    return placesWithImages;
  } catch (error) {
    console.error(`Error fetching ${query}:`, error.message);
    return [];
  }
};

app.get("/live-events", async (req, res) => {
  const { location, date } = req.query;
  if (!location || !date) {
    return res.status(400).json({ error: "Location and date are required" });
  }

  const ticketmasterAPI = "https://app.ticketmaster.com/discovery/v2/events.json";
  const params = {
    apikey: process.env.TICKETMASTER_API_KEY,
    city: location,
    startDateTime: `${date}T00:00:00Z`,
    radius: 50,
    classificationName: "festival,cinema,comedy,music,sports",
    size: 16,
    sort: "date,asc",
  };

  try {
    const response = await axios.get(ticketmasterAPI, { params });
    if (response.data._embedded && response.data._embedded.events) {
      const events = response.data._embedded.events
        .filter(event => event.dates.start.localDate === date)
        .map(event => ({
          name: event.name,
          venue: event._embedded.venues[0].name,
          address: event._embedded.venues[0].address.line1,
          city: event._embedded.venues[0].city.name,
          country: event._embedded.venues[0].country.name,
          date: event.dates.start.localDate,
          time: event.dates.start.localTime || "TBD",
          image: event.images[0]?.url || "",
          latitude: event._embedded.venues[0].location.latitude,
          longitude: event._embedded.venues[0].location.longitude,
        }));
      res.json(events);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ error: "Failed to fetch event data" });
  }
});

//tourist places
app.get("/tourist-places", async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: "Location is required." });
  }

  try {
    const places = await fetchTouristPlaces(location);
    res.json(places);
  } catch (error) {
    console.error("Error fetching tourist places:", error.message);
    res.status(500).json({ error: "Failed to fetch tourist places." });
  }
});



// API Endpoint to fetch restaurants (unchanged)
app.get("/restaurants", async (req, res) => {
  const { location, budget } = req.query;

  try {
    const { latitude, longitude } = await getCoordinates(location);

    const foursquareAPI = "https://api.foursquare.com/v3/places/search";
    const foursquarePhotoAPI = (venueId) =>
      `https://api.foursquare.com/v3/places/${venueId}/photos`;

    const headers = {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY,
    };

    const response = await axios.get(foursquareAPI, {
      headers,
      params: {
        ll: `${latitude},${longitude}`,
        query: "restaurant",
        radius: 5000,
        sort: "distance",
        price: budget,
        limit: 10,
      },
    });

    const restaurants = response.data.results;

    const restaurantData = await Promise.all(
      restaurants.map(async (restaurant) => {
        try {
          const photoResponse = await axios.get(
            foursquarePhotoAPI(restaurant.fsq_id),
            { headers }
          );
          const photos = photoResponse.data;

          let photoUrl = "https://via.placeholder.com/250x150.png?text=No+Image"; // Default image
          if (photos.length > 0) {
            photoUrl = `${photos[0].prefix}original${photos[0].suffix}`;
          }
          return {
            id: restaurant.fsq_id,
            name: restaurant.name,
            location: restaurant.location,
            photo: photoUrl,
            geocodes: restaurant.geocodes,
          };
        } catch (error) {
          console.error(
            `Error fetching photo for restaurant ${restaurant.fsq_id}:`,
            error.message
          );
          return null;
        }
      })
    );

    const filteredData = restaurantData.filter((item) => item !== null);

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching restaurants:", error.message);
    res.status(500).json({ error: "Failed to fetch restaurant data." });
  }
});

// Endpoint to fetch hospitals, clinics, and pharmacies (new endpoints)
app.get("/:type", async (req, res) => {
  const { location } = req.query;
  const { type } = req.params; // hospital, clinic, pharmacy

  if (!location || !["hospitals", "clinics", "pharmacies"].includes(type)) {
    return res.status(400).json({ error: "Invalid request parameters." });
  }

  try {
    const places = await fetchPlaces(location, type);
    res.json(places);
  } catch (error) {
    console.error(`Error fetching ${type}:`, error.message);
    res.status(500).json({ error: `Failed to fetch ${type} data.` });
  }
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});