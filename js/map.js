// Initialize the map
var map = L.map('map').setView([-1.286389, 36.817223], 12); // Nairobi

// Add OpenStreetMap basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to load GeoJSON files
function loadGeoJSON(url, style, layerName) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            var layer = L.geoJSON(data, {
                style: style,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup(`<b>${layerName}</b><br>${feature.properties.name}`);
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error(`Error loading ${layerName}:`, error));
}

// Function to load KML file and convert to GeoJSON
function loadKML(url, layerName) {
    fetch(url)
        .then(response => response.text())
        .then(kmlText => {
            var parser = new DOMParser();
            var kml = parser.parseFromString(kmlText, "text/xml");
            var geojson = toGeoJSON.kml(kml);
            L.geoJSON(geojson, {
                style: { color: "red" },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup(`<b>${layerName}</b><br>${feature.properties.name}`);
                    }
                }
            }).addTo(map);
        })
        .catch(error => console.error(`Error loading ${layerName}:`, error));
}

// Load GeoJSON layers
loadGeoJSON("data/class_ABC_roads.geojson", { color: "blue", weight: 2 }, "Class ABC Roads");
loadGeoJSON("data/parking_lots.geojson", { color: "green", weight: 2 }, "Parking Lots");
loadGeoJSON("data/pickup_points.geojson", { color: "purple", weight: 2 }, "Pickup Points");
loadGeoJSON("data/garages.geojson", { color: "brown", weight: 2 }, "Garages");

// Load KML layer
loadKML("data/charging_stations.kml", "Charging Stations");
