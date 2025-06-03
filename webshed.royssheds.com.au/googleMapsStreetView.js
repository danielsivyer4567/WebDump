import React, { useEffect, useRef, useState } from 'react';

const GoogleMapsStreetView = () => {
  const mapRef = useRef(null);
  const panoramaRef = useRef(null);
  const [searchInput, setSearchInput] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize Google Maps and Street View
  useEffect(() => {
    // Define the initMap function that will be called as a callback
    window.initMap = function() {
      // Default location (Australia)
      const defaultLocation = { lat: -34.397, lng: 150.644 };
      
      // Create a new map instance
      const map = new google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 8,
        streetViewControl: false, // We'll handle this ourselves
      });

      // Create the street view panorama
      const panorama = new google.maps.StreetViewPanorama(panoramaRef.current, {
        position: defaultLocation,
        pov: {
          heading: 34,
          pitch: 10,
        },
        addressControl: true,
        fullscreenControl: true,
      });

      // Link the map with the street view
      map.setStreetView(panorama);
      
      // Create autocomplete for search input
      const searchBox = document.getElementById('location-search');
      const autocomplete = new google.maps.places.Autocomplete(searchBox);
      
      // Listen for place changes
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
          setErrorMessage('No location found for this search. Please try again.');
          return;
        }
        
        setErrorMessage('');
        
        // Update map and street view with new location
        const position = place.geometry.location;
        map.setCenter(position);
        
        // Check if Street View is available at this location
        const streetViewService = new google.maps.StreetViewService();
        streetViewService.getPanorama({ location: position, radius: 50 }, (data, status) => {
          if (status === google.maps.StreetViewStatus.OK) {
            panorama.setPosition(data.location.latLng);
          } else {
            setErrorMessage('Street View is not available at this location.');
          }
        });
      });
      
      setMapLoaded(true);
    };

    // Load Google Maps API script with callback
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCBiMRL7l0cbBOXWl4-5N1_SdAKW1nXwPg&callback=initMap&libraries=places`;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadScript();
    
    // Cleanup
    return () => {
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => script.remove());
      delete window.initMap;
    };
  }, []);

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle use my location button click
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }
    
    setErrorMessage('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        if (mapLoaded && window.google && window.google.maps) {
          // Update map center
          const map = panoramaRef.current.getMap();
          map.setCenter(userLocation);
          
          // Check if Street View is available at this location
          const streetViewService = new google.maps.StreetViewService();
          streetViewService.getPanorama({ location: userLocation, radius: 50 }, (data, status) => {
            if (status === google.maps.StreetViewStatus.OK) {
              panoramaRef.current.setPosition(data.location.latLng);
            } else {
              setErrorMessage('Street View is not available at your location.');
            }
          });
        }
      },
      (error) => {
        setErrorMessage(`Error getting your location: ${error.message}`);
      }
    );
  };

  return (
    <div className="google-maps-container">
      <div className="search-container">
        <input
          id="location-search"
          type="text"
          placeholder="Search for a location"
          value={searchInput}
          onChange={handleSearchInputChange}
          className="search-input"
        />
        <button
          onClick={handleUseMyLocation}
          className="location-button"
        >
          Use My Location
        </button>
      </div>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <div ref={mapRef} className="map-container"></div>
      <div ref={panoramaRef} className="panorama-container"></div>
    </div>
  );
};

export default GoogleMapsStreetView; 