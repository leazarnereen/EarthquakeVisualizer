import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup,useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ZoomToCountry = ({ earthquakes, selectedCountry }: { earthquakes: any[], selectedCountry: string }) => {
  const map = useMap();

  if (!selectedCountry || earthquakes.length === 0) return null;

  const filtered = earthquakes.filter(eq => {
    const parts = eq.properties.place?.split(",");
    const country = parts ? parts[parts.length - 1].trim() : "Unknown";
    return country === selectedCountry;
  });

  if (filtered.length > 0) {
    const bounds = L.latLngBounds(
      filtered.map(eq => [eq.geometry.coordinates[1], eq.geometry.coordinates[0]])
    );
    map.fitBounds(bounds, { padding: [50, 50] }); // add padding for better view
  }

  return null;
};

const EARTHQUAKE_URL =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Helper for marker icon based on magnitude
const getIcon = (mag: number) =>
  L.icon({
    iconUrl:
      mag >= 5
        ? 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png'
        : mag >= 3
        ? 'https://maps.gstatic.com/mapfiles/ms2/micons/orange-dot.png'
        : 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

// Extract country from the "place" string
const getCountryFromPlace = (place: string): string => {
  if (!place) return "Unknown";
  const parts = place.split(",");
  return parts[parts.length - 1].trim(); // last part usually contains country
};

const Map = () => {
  const [earthquakes, setEarthquakes] = useState<any[]>([]);
  const [countryCounts, setCountryCounts] = useState<{ [country: string]: number }>({});
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch earthquake data
  useEffect(() => {
    setLoading(true);
    fetch(EARTHQUAKE_URL)
      .then(res => res.json())
      .then(data => {
        const eqs = data.features || [];
        setEarthquakes(eqs);

        // Count earthquakes per country
        const counts: { [country: string]: number } = {};
        eqs.forEach((eq: any) => {
          const country = getCountryFromPlace(eq.properties.place);
          counts[country] = (counts[country] || 0) + 1;
        });
        setCountryCounts(counts);

        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch earthquake data.');
        setLoading(false);
      });
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSearchResult(countryCounts[country] || 0);
  };

  return (
    <div className="main-grid">
      <div className="map-area">
        {loading ? (
          <div className="center-message">Loading map and earthquakes...</div>
        ) : error ? (
          <div className="center-message error">{error}</div>
        ) : (
          <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    noWrap={true}
  />

  {/* Zoom behavior when country is selected */}
  <ZoomToCountry earthquakes={earthquakes} selectedCountry={selectedCountry} />

  {earthquakes.map(eq => (
    <Marker
      key={eq.id}
      position={[eq.geometry.coordinates[1], eq.geometry.coordinates[0]]}
      icon={getIcon(eq.properties.mag)}
    >
      <Popup>
        <strong>{eq.properties.place}</strong><br />
        Magnitude: {eq.properties.mag}<br />
        Time: {new Date(eq.properties.time).toLocaleString()}
      </Popup>
    </Marker>
  ))}
</MapContainer>

        )}
      </div>

      <div className="sidebar">
        <div className="search-section">
          <label htmlFor="country-select"><strong>Search by Country</strong></label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={handleCountryChange}
            className="country-select"
            disabled={loading}
          >
            <option value="">Select a country</option>
            {Object.keys(countryCounts)
              .filter(c => c !== 'Unknown')
              .sort()
              .map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            <option value="Unknown">Unknown/Ocean</option>
          </select>

          {selectedCountry && (
            <div className="search-result">
              {searchResult === 0 ? (
                <span>
                  <strong>{selectedCountry}</strong> has <strong>no</strong> earthquakes found.
                </span>
              ) : (
                <span>
                  <strong>{selectedCountry}</strong> has <strong>{searchResult}</strong> earthquake(s).
                </span>
              )}
            </div>
          )}
        </div>

        <div className="country-graph">
          <strong>Earthquakes by Country</strong>
          <div className="country-list">
            {Object.entries(countryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([country, count]) => (
                <div className="country-row" key={country}>
                  <span className="country-name">{country}</span>
                  <span className="country-count">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
