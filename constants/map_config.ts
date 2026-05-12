// MAP CONFIGURATION — static layout and sizing constants for map UI

export const MAP_PIN_SIZE = 28;
export const MAP_LABEL_MAX_WIDTH = 110;
export const MAP_NEARBY_RADIUS_KM = 5;
export const MAP_DEFAULT_DELTA = 0.02;

export const MAP_DEFAULT_REGION = {
  latitude: 13.1391,
  longitude: 123.7438,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Hides Google Maps built-in POI and transit pins — only KainTayo spots appear
export const MAP_STYLE = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];
