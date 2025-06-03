# Google Maps Street View Integration

This project replaces the existing WebShed 3D viewer with Google Maps Street View, allowing users to explore locations in street view with additional features like location search and "use my location" functionality.

## Features

- Full Google Maps Street View integration
- Location search with autocomplete
- "Use My Location" button for quick navigation to your current location
- Small map overview in the bottom right corner
- Error handling for locations without Street View availability

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Update the Google Maps API key:
   - Open `googleMapsStreetView.js`
   - Replace `YOUR_API_KEY` with your actual Google Maps API key in the script.src URL
   - Make sure your API key has the following APIs enabled:
     - Maps JavaScript API
     - Street View API
     - Places API

4. Run the development server:
   ```
   npm run dev
   ```

5. Build for production:
   ```
   npm run build
   ```

## Implementation Details

The Google Maps integration uses the callback pattern for loading the API:

```javascript
// Define callback function that will initialize the map
window.initMap = function() {
  // Map initialization code here
};

// Load the Google Maps API with the callback
function loadScript() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=places`;
  script.defer = true;
  document.head.appendChild(script);
}

loadScript();
```

This approach ensures that the map is only initialized after the Google Maps API is fully loaded.

## Usage

- **Search**: Type an address or location name in the search box
- **Use My Location**: Click the "Use My Location" button to navigate to your current location
- **Navigation**: Use the Street View controls to navigate:
  - Drag to look around
  - Click on the street to move forward
  - Use the navigation controls to move in different directions

## Requirements

- Google Maps API key with access to Maps JavaScript API, Street View API, and Places API
- Modern web browser with JavaScript enabled
- Location services enabled for "Use My Location" functionality

## Notes

- Street View may not be available in all locations
- The application will display an error message when Street View data is not available for a location 