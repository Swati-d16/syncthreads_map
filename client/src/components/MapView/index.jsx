import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './index.css';

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ZoomControls = ({ location, zoomLevel }) => {
    const map = useMap();
  
    const handleZoomIn = () => {
      if (location) {
        map.setView([location.latitude, location.longitude], zoomLevel + 1);
      } else {
        map.setZoom(zoomLevel + 1);
      }
    };
  
    const handleZoomOut = () => {
      map.setZoom(zoomLevel - 1);
    };
  
    return (
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
    );
  };

const MapView = () => {
  const { cardId } = useParams();
  const [zoomLevel, setZoomLevel] = useState(5);
  const [figmaData, setFigmaData] = useState(null);
  const [location, setLocation] = useState(null);

  const FIGMA_FILE_ID = "swatisyncthreads"; 
  const FIGMA_API_TOKEN = "figd_Z-D6aqNLRxkm01-KWisSiFoSphqGz9vPWHN23Rvx"; 

  // Fetch Figma Design Data
  const fetchFigmaData = async () => {
    try {
      const response = await axios.get(
        `https://api.figma.com/v1/files/${FIGMA_FILE_ID}`,
        { headers: { "X-Figma-Token": FIGMA_API_TOKEN } }
      );
      setFigmaData(response.data);
    } catch (error) {
      console.error("Error fetching Figma data:", error);
    }
  };

  // Get User Location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setZoomLevel(10);
        },
        (error) => console.error("Error fetching location:", error)
      );
    } else {
      console.error("Geolocation not supported");
    }
  };

  useEffect(() => {
    fetchLocation();
    fetchFigmaData();
  }, []);

  return (
    <div className="map-container">
      <h2>Your Current Location {cardId && `for Card ${cardId}`}</h2>

      {location && (
        <p>Your Location: {location.latitude}, {location.longitude}</p>
      )}

      <MapContainer
        center={location ? [location.latitude, location.longitude] : [20.5937, 78.9629]}
        zoom={zoomLevel}
        className="full-screen-map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {location && (
          <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
        
        <ZoomControls zoomLevel={zoomLevel} />
      </MapContainer>

      
    </div>
  );
};

export default MapView;
