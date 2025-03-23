const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = process.env.PORT || 8000;
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root", // Change based on your MySQL setup
  password: "root",
  database: "travel",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// Save restaurant to profile
app.post("/save-restaurant", (req, res) => {
  console.log("Received request body:", req.body);
  const {  restaurantId, name, address, photo, latitude, longitude } = req.body;

  const userId = req.body.userId || 1;

  const query = `
    INSERT INTO saved_restaurants (user_id, restaurant_id, name, address, photo, latitude, longitude) 
    VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, address=?, photo=?, latitude=?, longitude=?`;

  db.query(
    query,
    [userId, restaurantId, name, address, photo, latitude, longitude, name, address, photo, latitude, longitude],
    (err, result) => {
      if (err) {
        console.error("Error saving restaurant:", err);
        return res.status(500).json({ error: "Failed to save restaurant" });
      }
      res.status(200).json({ message: "Restaurant saved successfully!" });
    }
  );
});

// Get saved restaurants for a user
app.get("/saved-restaurants/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT id, name, address, image_url, latitude, longitude FROM saved_restaurants WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching saved restaurants:", err);
        return res.status(500).json({ error: "Failed to fetch saved restaurants" });
      }
      res.json(results);
    }
  );
});

app.delete("/delete-restaurant/:id", (req, res) => {
  const restaurantId = req.params.id;

  db.query("DELETE FROM saved_restaurants WHERE id = ?", [restaurantId], (err, result) => {
    if (err) {
      console.error("Error deleting restaurant:", err);
      return res.status(500).json({ error: "Failed to delete restaurant" });
    }
    res.json({ success: true, message: "Restaurant deleted successfully" });
  });
});


app.post("/delete-restaurant", (req, res) => {
  const { userId, restaurantId } = req.body;

  if (!userId || !restaurantId) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  const query = "DELETE FROM saved_restaurants WHERE user_id = ? AND restaurant_id = ?";

  db.query(query, [userId, restaurantId], (err, result) => {
    if (err) {
      console.error("Error deleting restaurant:", err);
      return res.status(500).json({ message: "Error deleting restaurant" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant unsaved successfully" });
  });
});


app.post("/save-hospital", (req, res) => {
  console.log("Received request body:", req.body);
  const { userId,hospitalId, name, address, photo, latitude, longitude } = req.body;
  // const userId = req.body.userId || 1;
  console.log("Received request body:", req.body);
  const query = `
    INSERT INTO saved_hospitals (user_id, hospital_id, name, address, photo, latitude, longitude) 
    VALUES (?, ?, ?, ?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE 
    name = VALUES(name), 
    address = VALUES(address), 
    photo = VALUES(photo), 
    latitude = VALUES(latitude), 
    longitude = VALUES(longitude);`;

  db.query(
    query,
    [userId, hospitalId, name, address, photo, latitude, longitude, name, address, photo, latitude, longitude],
    (err, result) => {
      if (err) {
        console.error("Error saving hospital:", err);
        return res.status(500).json({ error: "Failed to save hospital" });
      }
      res.status(200).json({ message: "Hospital saved successfully!" });
    }
  );
});

// Get saved hospitals for a user
app.get("/saved-hospitals/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT id, name, address, photo, latitude, longitude FROM saved_hospitals WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching saved hospitals:", err);
        return res.status(500).json({ error: "Failed to fetch saved hospitals" });
      }
      res.json(results);
    }
  );
});

// Delete a saved hospital by ID
app.delete("/delete-hospital/:id", (req, res) => {
  const hospitalId = req.params.id;

  db.query("DELETE FROM saved_hospitals WHERE id = ?", [hospitalId], (err, result) => {
    if (err) {
      console.error("Error deleting hospital:", err);
      return res.status(500).json({ error: "Failed to delete hospital" });
    }
    res.json({ success: true, message: "Hospital deleted successfully" });
  });
});

// Unsave hospital for a user
app.post("/delete-hospital", (req, res) => {
  const { userId, hospitalId } = req.body;

  if (!userId || !hospitalId) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  const query = "DELETE FROM saved_hospitals WHERE user_id = ? AND hospital_id = ?";

  db.query(query, [userId, hospitalId], (err, result) => {
    if (err) {
      console.error("Error deleting hospital:", err);
      return res.status(500).json({ message: "Error deleting hospital" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.json({ message: "Hospital unsaved successfully" });
  });
});


// Save live event to profile
app.post("/save-event", (req, res) => {
  console.log("Received request body:", req.body);
  const { eventId, name, venue, city, country, date, time, latitude, longitude, image, url } = req.body;
  const userId = req.body.userId || 1;

  if (!eventId) {
    return res.status(400).json({ error: "Missing event ID" });
  }

  const query = `
    INSERT INTO saved_events (user_id, event_id, name, venue, city, country, date, time, latitude, longitude, image, url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE name=?, venue=?, city=?, country=?, date=?, time=?, latitude=?, longitude=?, image=?, url=?`;

  db.query(
    query,
    [
      userId, eventId, name, venue, city, country, date, time, latitude, longitude, image, url,
      name, venue, city, country, date, time, latitude, longitude, image, url
    ],
    (err, result) => {
      if (err) {
        console.error("Error saving event:", err);
        return res.status(500).json({ error: "Failed to save event" });
      }
      res.status(200).json({ message: "Event saved successfully!" });
    }
  );
});



// Get saved live events for a user
app.get("/saved-events/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT id, event_id, name, venue, city, country, date, time, latitude, longitude, image, url FROM saved_events WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching saved events:", err);
        return res.status(500).json({ error: "Failed to fetch saved events" });
      }
      res.json(results);
    }
  );
});

// Delete saved event by ID
app.delete("/delete-event/:id", (req, res) => {
  const eventId = req.params.id;

  db.query("DELETE FROM saved_events WHERE id = ?", [eventId], (err, result) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res.status(500).json({ error: "Failed to delete event" });
    }
    res.json({ success: true, message: "Event deleted successfully" });
  });
});

// Delete saved event by user ID and event ID
app.post("/delete-event", (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  const query = "DELETE FROM saved_events WHERE user_id = ? AND event_id = ?";

  db.query(query, [userId, eventId], (err, result) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res.status(500).json({ message: "Error deleting event" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event unsaved successfully" });
  });
});


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
          id: event.id,
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
        let photoUrl = "https://via.placeholder.com/250x150.png?text=No+Image";
        try {
          const photoResponse = await axios.get(
            foursquarePhotoAPI(restaurant.fsq_id),
            { headers }
          );
          const photos = photoResponse.data;

          if (photos.length > 0) {
            photoUrl = `${photos[0].prefix}original${photos[0].suffix}`;
          } else {
            photoUrl = await fetchImageFromUnsplash(restaurant.name);
          }
        } catch (error) {
          console.error(
            `Error fetching photo for restaurant ${restaurant.fsq_id}:`,
            error.message
          );
          photoUrl = await fetchImageFromUnsplash(restaurant.name);
        }

        return {
          id: restaurant.fsq_id,
          name: restaurant.name,
          location: restaurant.location,
          photo: photoUrl,
          geocodes: restaurant.geocodes,
        };
      })
    );

    const filteredData = restaurantData.filter((item) => item !== null);

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching restaurants:", error.message);
    res.status(500).json({ error: "Failed to fetch restaurant data." });
  }
});

// app.get("/restaurants", async (req, res) => {
//   const { location, budget } = req.query;

//   try {
//     const { latitude, longitude } = await getCoordinates(location);

//     const foursquareAPI = "https://api.foursquare.com/v3/places/search";
//     const foursquarePhotoAPI = (venueId) =>
//       `https://api.foursquare.com/v3/places/${venueId}/photos`;
//     const foursquareMenuAPI = (venueId) =>
//       `https://api.foursquare.com/v3/places/${venueId}/menu`;

//     const headers = {
//       Accept: "application/json",
//       Authorization: process.env.FOURSQUARE_API_KEY,
//     };

//     const response = await axios.get(foursquareAPI, {
//       headers,
//       params: {
//         ll: `${latitude},${longitude}`,
//         query: "restaurant",
//         radius: 5000,
//         sort: "distance",
//         price: budget,
//         limit: 10,
//       },
//     });

//     const restaurants = response.data.results;

//     const restaurantData = await Promise.all(
//       restaurants.map(async (restaurant) => {
//         let photoUrl = "https://via.placeholder.com/250x150.png?text=No+Image";
//         try {
//           const photoResponse = await axios.get(
//             foursquarePhotoAPI(restaurant.fsq_id),
//             { headers }
//           );
//           const photos = photoResponse.data;
//           if (photos.length > 0) {
//             photoUrl = `${photos[0].prefix}original${photos[0].suffix}`;
//           } else {
//             photoUrl = await fetchImageFromUnsplash(restaurant.name);
//           }
//         } catch (error) {
//           console.error(
//             `Error fetching photo for restaurant ${restaurant.fsq_id}:`,
//             error.message
//           );
//           photoUrl = await fetchImageFromUnsplash(restaurant.name);
//         }

//         // Fetch Menu Data from Foursquare
//         let menu = [];
//         try {
//           const menuResponse = await axios.get(
//             foursquareMenuAPI(restaurant.fsq_id),
//             { headers }
//           );
//           menu = menuResponse.data.menus ;
//         } catch (error) {
//           console.error(
//             `Error fetching menu for restaurant ${restaurant.fsq_id}:`,
//             error.message
//           );
//         }

//         return {
//           id: restaurant.fsq_id,
//           name: restaurant.name,
//           location: restaurant.location,
//           photo: photoUrl,
//           geocodes: restaurant.geocodes,
//           menu, // Include the menu in response
//         };
//       })
//     );

//     const filteredData = restaurantData.filter((item) => item !== null);

//     res.json(filteredData);
//   } catch (error) {
//     console.error("Error fetching restaurants:", error.message);
//     res.status(500).json({ error: "Failed to fetch restaurant data." });
//   }
// });




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
