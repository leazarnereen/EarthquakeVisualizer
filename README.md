# Earthquake Visualizer

Earthquake Visualizer is a web application that allows users to explore and analyze recent earthquake activity around the world. The app features an interactive map, country-based earthquake statistics, and a responsive, user-friendly interface.

---

## Application Overview

- **Interactive Map:** Displays earthquake locations using colored markers based on magnitude.
- **Country Search:** Lets users select a country and instantly see the number of earthquakes detected there.
- **Statistics Panel:** Shows a sorted list of earthquake counts by country.
- **Responsiveness:** The layout adapts for both desktop and mobile devices.
- **Error Handling:** Provides clear messages for loading states, network errors, and empty results.

---

## Code Structure and Logic

### 1. **Fetching Earthquake Data**
- The app fetches earthquake data in GeoJSON format from the [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).
- Data is retrieved using the `fetch` API inside a React `useEffect` hook.
- The data includes earthquake coordinates, magnitude, and a descriptive location string.

### 2. **Country Detection**
- For each earthquake, the app attempts to extract the country name from the `place` string provided by the USGS API.
- If the country cannot be determined, it is labeled as "Unknown" or "Ocean".
- The app counts the number of earthquakes per country and stores this in state for fast lookup.

### 3. **Map Visualization**
- The map is rendered using [React-Leaflet](https://react-leaflet.js.org/), a React wrapper for the [Leaflet](https://leafletjs.com/) mapping library.
- Each earthquake is shown as a marker on the map.
- Marker color indicates earthquake magnitude:
  - **Red:** Magnitude ≥ 5
  - **Orange:** Magnitude 3–4.9
  - **Yellow:** Magnitude < 3
- Clicking a marker opens a popup with details about the earthquake.

### 4. **Country Search and Statistics**
- A dropdown menu lists all detected countries.
- When a user selects a country, the app displays the number of earthquakes for that country.
- A statistics panel shows all countries with their respective earthquake counts, sorted by count.

### 5. **Responsiveness and Layout**
- The layout uses CSS Grid and Flexbox for a modern, responsive design.
- On desktop, the map takes up 80% of the width, with the sidebar on the right.
- On mobile, the map and sidebar stack vertically for better usability.

### 6. **Error Handling and User Experience**
- Loading indicators are shown while data is being fetched.
- If there is a network error or no data is found, a clear message is displayed.
- The UI is designed to be clean, accessible, and easy to navigate.

---

## Libraries Used and Their Purpose

### **React**
- **Purpose:** Core framework for building the user interface using components and hooks.
- **Why:** Enables fast, modular, and maintainable UI development.

### **React-Leaflet**
- **Purpose:** Integrates Leaflet maps into React applications.
- **Why:** Allows for declarative map rendering and easy management of map state within React.

### **Leaflet**
- **Purpose:** Provides interactive maps, marker layers, and popups.
- **Why:** Lightweight, mobile-friendly, and highly customizable for geospatial visualization.

### **USGS Earthquake API**
- **Purpose:** Supplies real-time earthquake data in GeoJSON format.
- **Why:** Reliable, up-to-date source for global seismic activity.

### **TypeScript (optional)**
- **Purpose:** Adds static typing to JavaScript code.
- **Why:** Improves code quality, maintainability, and developer experience.

---

## How the Main Features Work

- **Data Fetching:** On load, the app fetches the latest earthquake data from the USGS API.
- **Country Extraction:** The app parses the location string of each earthquake to determine the country.
- **Map Rendering:** Earthquakes are plotted on the map with color-coded markers.
- **Country Search:** Users select a country from a dropdown to see earthquake counts.
- **Statistics Panel:** All countries are listed with their earthquake counts for quick comparison.
- **Responsiveness:** The layout adapts to different screen sizes for optimal viewing.

---

## Customization

- **Marker Icons:** Easily change marker colors or icons by modifying the `getIcon` function.
- **Data Range:** To show more than just today’s earthquakes, update the USGS API endpoint.
- **Country Detection:** For more accurate country detection, integrate a geospatial library or reverse geocoding service.

---

## Conclusion

Earthquake Visualizer combines real-time data, interactive mapping, and a clean UI to help users understand global seismic activity at a glance. The use of React, React-Leaflet, and the USGS API ensures a