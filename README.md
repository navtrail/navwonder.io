import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map"; // Import the Map component
import About from "./pages/About"; // Import the About component
import HomeScreen from "./pages/HomeScreen"; // Import the HomeScreen component
import NavigationScreen from "./pages/NavigationScreen"; // Import the NavigationScreen component
import TripPlanningScreen from "./pages/TripPlanningScreen"; // Import the TripPlanningScreen component
import HotelRestaurantDiscovery from "./pages/HotelRestaurantDiscovery"; // Import the HotelRestaurantDiscovery component
import ProfileSettings from "./pages/ProfileSettings"; // Import the ProfileSettings component
import OfflineMapsUI from "./pages/OfflineMapsUI"; // Import the OfflineMapsUI component
import TravelPackages from "./pages/TravelPackages"; // Import the TravelPackages component
import Navbar from "./components/Navbar";
import TabBar from "./components/TabBar"; // Import the TabBar component
import Sidebar from "./components/Sidebar"; // Import the Sidebar component
import "./App.css";
import { motion } from "framer-motion";

function App() {
  return (
    <Router>
      <motion.div 
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} /> {/* Add the Map route */}
          <Route path="/about" element={<About />} /> {/* Add the About route */}
          <Route path="/home-screen" element={<HomeScreen />} /> {/* Add the HomeScreen route */}
          <Route path="/navigation" element={<NavigationScreen />} /> {/* Add the NavigationScreen route */}
          <Route path="/trip-planning" element={<TripPlanningScreen />} /> {/* Add the TripPlanningScreen route */}
          <Route path="/hotel-restaurant-discovery" element={<HotelRestaurantDiscovery />} /> {/* Add the HotelRestaurantDiscovery route */}
          <Route path="/profile-settings" element={<ProfileSettings />} /> {/* Add the ProfileSettings route */}
          <Route path="/offline-maps" element={<OfflineMapsUI />} /> {/* Add the OfflineMapsUI route */}
          <Route path="/travel-packages" element={<TravelPackages />} /> {/* Add the TravelPackages route */}
        </Routes>
        <TabBar /> {/* Add the TabBar component */}
        <Sidebar /> {/* Add the Sidebar component */}
      </motion.div>
    </Router>
  );
}

export default App;


const themes = {
  light: {
    background: "#ffffff",
    text: "#000000",
    sidebar: "#f8f9fa",
    button: "#007bff",
    buttonText: "#ffffff",
    transition: "all 0.3s ease-in-out",
    card: "#f0f0f0",
    border: "#d1d1d1"
  },
  dark: {
    background: "#121212",
    text: "#ffffff",
    sidebar: "#1e1e1e",
    button: "#6200ea",
    buttonText: "#ffffff",
    transition: "all 0.3s ease-in-out",
    card: "#222222",
    border: "#444444"
  },
  adaptive: () => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? themes.light : themes.dark;
  }
};

const getStoredTheme = () => {
  return JSON.parse(localStorage.getItem("customTheme")) || localStorage.getItem("theme") || "adaptive";
};

const setStoredTheme = (theme) => {
  if (theme === "adaptive") {
    const adaptiveTheme = themes.adaptive();
    document.documentElement.style.setProperty("--background", adaptiveTheme.background);
    document.documentElement.style.setProperty("--text", adaptiveTheme.text);
    document.documentElement.style.setProperty("--sidebar", adaptiveTheme.sidebar);
    document.documentElement.style.setProperty("--button", adaptiveTheme.button);
    document.documentElement.style.setProperty("--buttonText", adaptiveTheme.buttonText);
    document.documentElement.style.setProperty("--card", adaptiveTheme.card);
    document.documentElement.style.setProperty("--border", adaptiveTheme.border);
    localStorage.setItem("theme", "adaptive");
  } else if (typeof theme === "object") {
    localStorage.setItem("customTheme", JSON.stringify(theme));
    document.documentElement.style.setProperty("--background", theme.background);
    document.documentElement.style.setProperty("--text", theme.text);
    document.documentElement.style.setProperty("--sidebar", theme.sidebar);
    document.documentElement.style.setProperty("--button", theme.button);
    document.documentElement.style.setProperty("--buttonText", theme.buttonText);
    document.documentElement.style.setProperty("--card", theme.card);
    document.documentElement.style.setProperty("--border", theme.border);
  } else {
    document.documentElement.style.transition = themes[theme].transition;
    localStorage.setItem("theme", theme);
  }
};

export { themes, getStoredTheme, setStoredTheme };


import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaMapMarkedAlt, FaSearchLocation, FaUserCircle, FaRoute, FaConciergeBell, FaBars, FaTimes, FaMoon, FaSun, FaBell, FaSignOutAlt, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";
import { getStoredTheme, setStoredTheme } from "../styles/theme"; // Import theme functions
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(getStoredTheme());
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const handleLogout = () => {
    alert("Logging out...");
    // Implement actual logout logic
  };

  return (
    <>
      <motion.button 
        className="sidebar-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }} 
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </motion.button>
      <motion.div 
        className={`sidebar ${isOpen ? "open" : "closed"}`}
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <img src="/profile-pic.jpg" alt="User Profile" className="profile-pic" />
          <h3>Sattu</h3>
          <p>Traveler | Explorer</p>
        </div>
        <nav className="sidebar-menu">
          <NavLink to="/map" activeClassName="active" onClick={() => setIsOpen(false)}>
            <FaMapMarkedAlt /> <span>Map</span>
          </NavLink>
          <NavLink to="/search" activeClassName="active" onClick={() => setIsOpen(false)}>
            <FaSearchLocation /> <span>Search</span>
          </NavLink>
          <NavLink to="/routes" activeClassName="active" onClick={() => setIsOpen(false)}>
            <FaRoute /> <span>Routes</span>
          </NavLink>
          <NavLink to="/services" activeClassName="active" onClick={() => setIsOpen(false)}>
            <FaConciergeBell /> <span>Services</span>
          </NavLink>
          <NavLink to="/profile" activeClassName="active" onClick={() => setIsOpen(false)}>
            <FaUserCircle /> <span>Profile</span>
          </NavLink>
        </nav>
        <div className="sidebar-settings">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? <FaMoon /> : <FaSun />} {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button className="notifications">
            <FaBell /> Notifications {notifications > 0 && <span className="badge">{notifications}</span>}
          </button>
          <NavLink to="/settings" className="settings-link">
            <FaCog /> <span>Settings</span>
          </NavLink>
          <button className="logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaMapMarkedAlt, FaSearchLocation, FaUserCircle, FaRoute, FaConciergeBell, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";
import "./TabBar.css";

const SwipeUpMenu = ({ isOpen, toggleMenu }) => {
  useEffect(() => {
    const handleSwipe = (event) => {
      if (event.deltaY < -30) toggleMenu(true);
      if (event.deltaY > 30) toggleMenu(false);
    };
    window.addEventListener("wheel", handleSwipe);
    return () => window.removeEventListener("wheel", handleSwipe);
  }, [toggleMenu]);

  return (
    <motion.div 
      className={`swipe-menu ${isOpen ? "open" : "closed"}`}
      initial={{ y: 100 }}
      animate={{ y: isOpen ? 0 : 100 }}
      transition={{ duration: 0.3 }}
    >
      <button className="swipe-handle" onClick={() => toggleMenu(!isOpen)}>
        <FaChevronUp />
      </button>
      {isOpen && (
        <div className="menu-items">
          <NavLink to="/map" activeClassName="active">
            <FaMapMarkedAlt />
            <span>Map</span>
          </NavLink>
          <NavLink to="/search" activeClassName="active">
            <FaSearchLocation />
            <span>Search</span>
          </NavLink>
          <NavLink to="/routes" activeClassName="active">
            <FaRoute />
            <span>Routes</span>
          </NavLink>
          <NavLink to="/services" activeClassName="active">
            <FaConciergeBell />
            <span>Services</span>
          </NavLink>
          <NavLink to="/profile" activeClassName="active">
            <FaUserCircle />
            <span>Profile</span>
          </NavLink>
        </div>
      )}
    </motion.div>
  );
};

const TabBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleTouchMove = (event) => {
      if (event.touches[0].clientY < 100) setMenuOpen(true);
      if (event.touches[0].clientY > window.innerHeight - 50) setMenuOpen(false);
    };
    window.addEventListener("touchmove", handleTouchMove);
    return () => window.removeEventListener("touchmove", handleTouchMove);
  }, []);

  return (
    <SwipeUpMenu isOpen={menuOpen} toggleMenu={setMenuOpen} />
  );
};

export default TabBar;

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

const Map = ({ longitude, latitude, zoom = 12 }) => {
  const mapContainerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v11");
  const [route, setRoute] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [trafficLayer, setTrafficLayer] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [speechSynthesis, setSpeechSynthesis] = useState(window.speechSynthesis);
  const [directions, setDirections] = useState([]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [longitude, latitude],
      zoom: zoom,
    });
    new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);
    // Add real-time traffic layer
    const trafficSource = "mapbox://styles/mapbox/traffic-day-v2";
    setTrafficLayer(new mapboxgl.StyleLayer(trafficSource));
    map.on("style.load", () => {
      map.addLayer({
        id: "traffic",
        type: "raster",
        source: {
          type: "raster",
          tiles: ["https://api.mapbox.com/styles/v1/mapbox/traffic-day-v2/tiles/{z}/{x}/{y}?access_token=" + mapboxgl.accessToken],
          tileSize: 256
        },
        layout: { visibility: "visible" }
      });
    });
    // Track user location and speed
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 14,
          });
          setSpeed(position.coords.speed || 0);
        },
        (error) => console.error("Error tracking location:", error),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
    return () => map.remove();
  }, [longitude, latitude, zoom, mapStyle]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setWaypoints([...waypoints, { lng, lat }]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleRoutePlanning = async () => {
    if (waypoints.length < 2) return;
    const waypointStr = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(";");
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${waypointStr}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      setRoute(data.routes[0].geometry.coordinates);
      setDirections(data.routes[0].legs.flatMap(leg => leg.steps.map(step => step.maneuver.instruction)));
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const speakDirections = () => {
    if (directions.length > 0) {
      const utterance = new SpeechSynthesisUtterance(directions.join(", "));
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div>
      <div className="map-controls">
        <input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Add Waypoint</button>
        <button onClick={handleRoutePlanning}>Plan Route</button>
        <button onClick={speakDirections}>🔊 Voice Navigation</button>
        <select onChange={(e) => setMapStyle(e.target.value)}>
          <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
          <option value="mapbox://styles/mapbox/outdoors-v11">Outdoors</option>
          <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
          <option value="mapbox://styles/mapbox/dark-v10">Dark</option>
        </select>
      </div>
      <div className="map-container" ref={mapContainerRef}></div>
      <div className="speed-indicator">Speed: {speed.toFixed(2)} m/s</div>
    </div>
  );
};

export default Map;


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./TravelPackages.css";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const API_BASE_URL = "https://your-backend.com/api";

const TravelPackages = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packages, setPackages] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortOption, setSortOption] = useState("highest-rated");
  const [reviews, setReviews] = useState({});
  const [priceComparisons, setPriceComparisons] = useState({});
  const [newReview, setNewReview] = useState({ packageId: "", text: "", rating: 0 });

  useEffect(() => {
    fetchTravelPackages();
  }, []);

  const fetchTravelPackages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/travel-packages`);
      setPackages(response.data);
      fetchReviews();
      fetchPriceComparisons();
    } catch (err) {
      setError("Failed to fetch travel packages");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/travel-packages/reviews`);
      setReviews(response.data);
    } catch (err) {
      console.error("Failed to fetch reviews");
    }
  };

  const fetchPriceComparisons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/travel-packages/price-comparisons`);
      setPriceComparisons(response.data);
    } catch (err) {
      console.error("Failed to fetch price comparisons");
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/travel-packages/reviews`, newReview);
      setNewReview({ packageId: "", text: "", rating: 0 });
      fetchReviews();
    } catch (err) {
      console.error("Failed to submit review");
    }
  };

  const filteredPackages = filter === "all" ? packages : packages.filter(pkg => pkg.type === filter);
  
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (sortOption === "highest-rated") {
      return (reviews[b.id]?.reduce((acc, rev) => acc + rev.rating, 0) || 0) - 
             (reviews[a.id]?.reduce((acc, rev) => acc + rev.rating, 0) || 0);
    } else if (sortOption === "most-recent") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOption === "price-lowest") {
      return a.price - b.price;
    }
    return 0;
  });

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTravelPackages} />;

  return (
    <motion.div 
      className="travel-packages-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 className="travel-packages-title" whileHover={{ scale: 1.1 }}>Explore Travel Packages ✈️</motion.h1>
      <motion.p className="travel-packages-description" whileHover={{ scale: 1.05 }}>Find the best deals for your next adventure.</motion.p>
      <div className="filter-section">
        <label>Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="luxury">Luxury</option>
          <option value="budget">Budget</option>
          <option value="adventure">Adventure</option>
        </select>
        <label>Sort By: </label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="highest-rated">Highest Rated</option>
          <option value="most-recent">Most Recent</option>
          <option value="price-lowest">Price: Lowest to Highest</option>
        </select>
      </div>
      <div className="packages-list">
        {sortedPackages.length > 0 ? (
          <ul>
            {sortedPackages.map((pkg) => (
              <motion.li 
                key={pkg.id} 
                className="package-item"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={pkg.imageUrl} alt={pkg.name} className="package-image" />
                <div className="package-info">
                  <h3 className="package-title">{pkg.name}</h3>
                  <p className="package-description">{pkg.description}</p>
                  <p className="package-price"><strong>Price:</strong> ${pkg.price}</p>
                  {priceComparisons[pkg.id] && (
                    <p className="package-providers"><strong>Other Providers:</strong> {priceComparisons[pkg.id].join(", ")}</p>
                  )}
                  <motion.button className="book-now" whileHover={{ scale: 1.1 }}>Book Now</motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="no-packages">No travel packages available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default TravelPackages;


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./OfflineMapsUI.css";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const API_BASE_URL = "https://your-backend.com/api";

const OfflineMapsUI = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offlineMaps, setOfflineMaps] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const [progress, setProgress] = useState({});
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetchOfflineMaps();
  }, []);

  const fetchOfflineMaps = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/offline-maps`);
      setOfflineMaps(response.data);
    } catch (err) {
      setError("Failed to fetch offline maps");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (mapId) => {
    setDownloading(mapId);
    setProgress((prev) => ({ ...prev, [mapId]: 0 }));
    try {
      const response = await axios.post(`${API_BASE_URL}/offline-maps/download`, { mapId }, {
        onDownloadProgress: (progressEvent) => {
          if (!paused) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress((prev) => ({ ...prev, [mapId]: percentCompleted }));
          }
        },
      });
      alert(`Downloaded: ${response.data.mapName}`);
      fetchOfflineMaps();
    } catch (err) {
      alert("Download failed");
    } finally {
      setDownloading(null);
    }
  };

  const handlePauseResume = () => {
    setPaused(!paused);
  };

  const handleDelete = async (mapId) => {
    try {
      await axios.delete(`${API_BASE_URL}/offline-maps/${mapId}`);
      alert("Map deleted successfully");
      fetchOfflineMaps();
    } catch (err) {
      alert("Failed to delete map");
    }
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOfflineMaps} />;

  return (
    <motion.div 
      className="offline-maps-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="offline-maps-title">Offline Maps 📍</h1>
      <p className="offline-maps-description">Download and manage offline maps.</p>
      <div className="maps-list">
        {offlineMaps.length > 0 ? (
          <ul>
            {offlineMaps.map((map) => (
              <li key={map.id} className="map-item">
                <img src={map.previewUrl} alt={map.name} className="map-preview" />
                <div className="map-info">
                  <span>{map.name}</span>
                  <button onClick={() => handleDownload(map.id)} disabled={downloading === map.id}>
                    {downloading === map.id ? "Downloading..." : "Download"}
                  </button>
                  {downloading === map.id && (
                    <button onClick={handlePauseResume}>
                      {paused ? "Resume" : "Pause"}
                    </button>
                  )}
                  <button onClick={() => handleDelete(map.id)} className="delete-button">Delete</button>
                </div>
                {downloading === map.id && (
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${progress[map.id] || 0}%` }}></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No offline maps available.</p>
        )}
      </div>
    </motion.div>
  );
};

export default OfflineMapsUI;



import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./HomeScreen.css";
import { ThemeContext } from "../styles/theme";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const API_BASE_URL = "https://your-backend.com/api";

const HomeScreen = () => {
  const { themeMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    fetchRecentSearches();
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recent-searches`);
      setRecentSearches(response.data);
    } catch (err) {
      setError("Failed to fetch recent searches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?autocomplete=true&country=us&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      );
      setSuggestions(response.data.features);
    } catch (err) {
      setError("Failed to fetch suggestions");
    }
  };

  const handleSelectSuggestion = async (place) => {
    setSearch(place.place_name);
    setSuggestions([]);
    try {
      await axios.post(`${API_BASE_URL}/recent-searches`, { search: place.place_name });
      fetchRecentSearches();
    } catch (err) {
      console.error("Failed to save recent search");
    }
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRecentSearches} />;

  return (
    <motion.div 
      className={`home-container ${themeMode}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="home-title">Welcome to NavTrail 🚀</h1>
      <p className="home-description">Your AI-powered navigation and trip-planning companion.</p>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={handleSearch}
        />
        <button onClick={handleSearch}>Search</button>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((place) => (
              <li key={place.id} onClick={() => handleSelectSuggestion(place)}>
                {place.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2>Recent Searches</h2>
      {recentSearches.length > 0 ? (
        <ul className="recent-searches">
          {recentSearches.map((search, index) => (
            <li key={index}>{search}</li>
          ))}
        </ul>
      ) : (
        <p>No recent searches found.</p>
      )}
    </motion.div>
  );
};

export default HomeScreen;



import React, { useState, useEffect, useRef, useContext } from "react";
import MapGL, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import axios from "axios";
import "./NavigationScreen.css";
import { ThemeContext } from "../styles/theme";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const API_BASE_URL = "https://your-backend.com/api";

const NavigationScreen = () => {
  const { themeMode } = useContext(ThemeContext);
  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 12,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setViewport((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
    fetchRecentSearches();
  }, []);

  const fetchRoute = async () => {
    if (!userLocation || !destination) return;
    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.longitude},${userLocation.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      );
      setRoute(response.data.routes[0].geometry);
    } catch (err) {
      setError("Failed to fetch route");
    }
  };

  useEffect(() => {
    if (destination) fetchRoute();
  }, [destination]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?autocomplete=true&country=us&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      );
      setSuggestions(response.data.features);
    } catch (err) {
      setError("Failed to fetch suggestions");
    }
  };

  const handleSelectSuggestion = async (place) => {
    setDestination({
      latitude: place.center[1],
      longitude: place.center[0],
    });
    setSearch(place.place_name);
    setSuggestions([]);

    try {
      await axios.post(`${API_BASE_URL}/recent-searches`, { search: place.place_name });
      fetchRecentSearches();
    } catch (err) {
      console.error("Failed to save recent search");
    }
  };

  const fetchRecentSearches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recent-searches`);
      setRecentSearches(response.data);
    } catch (err) {
      console.error("Failed to fetch recent searches");
    }
  };

  const clearRecentSearches = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/recent-searches`);
      setRecentSearches([]);
    } catch (err) {
      console.error("Failed to clear recent searches");
    }
  };

  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!userLocation) return <LoadingIndicator />;

  return (
    <div className={`navigation-container ${themeMode}`}>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={handleSearch}
        />
        <button onClick={handleSearch}>Search</button>
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((place) => (
              <li key={place.id} onClick={() => handleSelectSuggestion(place)}>
                {place.place_name}
              </li>
            ))}
          </ul>
        )}
        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <h4>Recent Searches:</h4>
            <ul>
              {recentSearches.map((place, index) => (
                <li key={index} onClick={() => setSearch(place)}>
                  {place}
                </li>
              ))}
            </ul>
            <button className="clear-btn" onClick={clearRecentSearches}>Clear Recent Searches</button>
          </div>
        )}
      </div>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        <Marker latitude={userLocation.latitude} longitude={userLocation.longitude}>
          <div className="marker user-marker" />
        </Marker>
        {destination && (
          <Marker latitude={destination.latitude} longitude={destination.longitude}>
            <div className="marker destination-marker" />
          </Marker>
        )}
        {route && (
          <Source id="route" type="geojson" data={{ type: "Feature", geometry: route }}>
            <Layer
              id="routeLayer"
              type="line"
              layout={{ "line-join": "round", "line-cap": "round" }}
              paint={{ "line-color": "#007AFF", "line-width": 5 }}
            />
          </Source>
        )}
        <NavigationControl style={{ right: 10, top: 10 }} />
      </MapGL>
    </div>
  );
};

export default NavigationScreen;


import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./TripPlanningScreen.css";
import { ThemeContext } from "../styles/theme";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const API_BASE_URL = "https://your-backend.com/api";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const EVENTS_API_URL = "https://your-backend.com/api/local-events";

const TripPlanningScreen = () => {
  const { themeMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripPlans, setTripPlans] = useState([]);
  const [newTrip, setNewTrip] = useState({ destination: "", startDate: "", endDate: "" });
  const [weather, setWeather] = useState(null);
  const [events, setEvents] = useState([]);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    fetchTripPlans();
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";
      speechRecognition.onresult = (event) => {
        setChatInput(event.results[0][0].transcript);
      };
      setRecognition(speechRecognition);
    }
  }, []);

  const fetchTripPlans = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trip-plans`);
      setTripPlans(response.data);
    } catch (err) {
      setError("Failed to fetch trip plans");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeather = async (destination) => {
    try {
      const response = await axios.get(`${WEATHER_API_URL}?q=${destination}&appid=your-weather-api-key&units=metric`);
      setWeather(response.data);
    } catch (err) {
      console.error("Failed to fetch weather data");
    }
  };

  const fetchEvents = async (destination) => {
    try {
      const response = await axios.get(`${EVENTS_API_URL}?location=${destination}`);
      setEvents(response.data);
    } catch (err) {
      console.error("Failed to fetch local events");
    }
  };

  const handleInputChange = (e) => {
    setNewTrip({ ...newTrip, [e.target.name]: e.target.value });
  };

  const handleCreateTrip = async () => {
    try {
      await axios.post(`${API_BASE_URL}/trip-plans`, newTrip);
      fetchTripPlans();
      fetchWeather(newTrip.destination);
      fetchEvents(newTrip.destination);
      setNewTrip({ destination: "", startDate: "", endDate: "" });
    } catch (err) {
      setError("Failed to create trip");
    }
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTripPlans} />;

  return (
    <motion.div 
      className={`trip-planning-container ${themeMode}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="trip-planning-title">Plan Your Trip ✈️</h1>
      <p className="trip-planning-description">View and manage your personalized trip plans.</p>
      <div className="trip-form">
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={newTrip.destination}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="startDate"
          value={newTrip.startDate}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="endDate"
          value={newTrip.endDate}
          onChange={handleInputChange}
        />
        <button onClick={handleCreateTrip}>Create Trip</button>
      </div>
      {weather && (
        <div className="weather-info">
          <h2>Weather Forecast ☀️</h2>
          <p>{weather.name}: {weather.weather[0].description}, {weather.main.temp}°C</p>
        </div>
      )}
      {events.length > 0 && (
        <div className="events-info">
          <h2>Local Events 🎭</h2>
          <ul>
            {events.map((event, index) => (
              <li key={index}>{event.name} - {event.date}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default TripPlanningScreen;

import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./HotelRestaurantDiscovery.css";
import { ThemeContext } from "../styles/theme";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const API_BASE_URL = "https://your-backend.com/api";

const HotelRestaurantDiscovery = () => {
  const { themeMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({ place: "", text: "", rating: 0 });

  useEffect(() => {
    fetchHotelsAndRestaurants("New York"); // Default location
  }, []);

  const fetchHotelsAndRestaurants = async (location) => {
    try {
      setIsLoading(true);
      const [hotelsRes, restaurantsRes, reviewsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/hotels?location=${location}`),
        axios.get(`${API_BASE_URL}/restaurants?location=${location}`),
        axios.get(`${API_BASE_URL}/reviews?location=${location}`),
      ]);
      setHotels(hotelsRes.data);
      setRestaurants(restaurantsRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      setError("Failed to fetch hotels, restaurants, and reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchLocation) {
      fetchHotelsAndRestaurants(searchLocation);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await axios.post(`${API_BASE_URL}/reviews`, newReview);
      fetchHotelsAndRestaurants(searchLocation || "New York");
      setNewReview({ place: "", text: "", rating: 0 });
    } catch (err) {
      console.error("Failed to submit review");
    }
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={() => fetchHotelsAndRestaurants("New York")} />;

  return (
    <motion.div 
      className={`hotel-restaurant-container ${themeMode}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="discovery-title">Discover Hotels & Restaurants 🍽️🏨</h1>
      <p className="discovery-description">Find the best places to stay and dine in your selected location.</p>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="results-container">
        <div className="hotels-section">
          <h2>Hotels 🏨</h2>
          {hotels.length > 0 ? (
            <ul>
              {hotels.map((hotel, index) => (
                <li key={index}>{hotel.name} - {hotel.rating}⭐</li>
              ))}
            </ul>
          ) : (
            <p>No hotels found.</p>
          )}
        </div>
        <div className="restaurants-section">
          <h2>Restaurants 🍽️</h2>
          {restaurants.length > 0 ? (
            <ul>
              {restaurants.map((restaurant, index) => (
                <li key={index}>{restaurant.name} - {restaurant.cuisine}</li>
              ))}
            </ul>
          ) : (
            <p>No restaurants found.</p>
          )}
        </div>
      </div>
      <div className="reviews-section">
        <h2>User Reviews ⭐</h2>
        {Object.keys(reviews).length > 0 ? (
          <ul>
            {Object.entries(reviews).map(([place, reviewList], index) => (
              <li key={index}>
                <h3>{place}</h3>
                <ul>
                  {reviewList.map((review, i) => (
                    <li key={i}>{review.text} - {review.rating}⭐</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews found.</p>
        )}
      </div>
      <div className="review-form">
        <h3>Submit a Review</h3>
        <input
          type="text"
          placeholder="Place Name"
          value={newReview.place}
          onChange={(e) => setNewReview({ ...newReview, place: e.target.value })}
        />
        <textarea
          placeholder="Write your review..."
          value={newReview.text}
          onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
        />
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
        />
        <button onClick={handleReviewSubmit}>Submit Review</button>
      </div>
    </motion.div>
  );
};

export default HotelRestaurantDiscovery;


import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import "./ProfileSettings.css";
import { ThemeContext } from "../styles/theme";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const API_BASE_URL = "https://your-backend.com/api";

const ProfileSettings = () => {
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", profilePicture: "" });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile`);
      setUserData(response.data);
      setFormData({ name: response.data.name, email: response.data.email, password: "", profilePicture: response.data.profilePicture });
    } catch (err) {
      setError("Failed to fetch profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUploadProfilePicture = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("profilePicture", imageFile);
    try {
      const response = await axios.post(`${API_BASE_URL}/user/upload-profile-picture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, profilePicture: response.data.url });
      fetchUserProfile();
    } catch (err) {
      setError("Failed to upload profile picture");
    }
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error} onRetry={fetchUserProfile} />;

  return (
    <motion.div 
      className={`profile-settings-container ${themeMode}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="profile-title">Profile Settings ⚙️</h1>
      {userData ? (
        <div className="profile-card">
          <img src={userData.profilePicture || "default-avatar.png"} alt="Profile" className="profile-picture" />
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUploadProfilePicture}>Upload</button>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <div className="theme-toggle">
            <p>Dark Mode:</p>
            <button onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}>
              {themeMode === "light" ? "Enable Dark Mode" : "Disable Dark Mode"}
            </button>
          </div>
        </div>
      ) : (
        <div className="social-login">
          <h2>Login with:</h2>
          <GoogleLogin
            clientId="YOUR_GOOGLE_CLIENT_ID"
            buttonText="Login with Google"
            onSuccess={handleGoogleLogin}
            onFailure={handleGoogleLogin}
            cookiePolicy={'single_host_origin'}
          />
          <FacebookLogin
            appId="YOUR_FACEBOOK_APP_ID"
            fields="name,email,picture"
            callback={handleFacebookLogin}
          />
        </div>
      )}
    </motion.div>
  );
};

export default ProfileSettings;





