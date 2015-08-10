var mapid = 'ruben.lg5gcamb'; //'bobbysud.79c006a5';
var token = 'pk.eyJ1IjoicnViZW4iLCJhIjoiYlBrdkpRWSJ9.JgDDxJkvDn3us36aGzR6vg';
L.mapbox.accessToken = token;
var host = 'localhost';
var map = L.mapbox.map('map', mapid);

var geojson = {
    "type": "Feature",
    "properties": {
        "mapid": mapid,
        "token": token,
        "zoom": 0
    },
    "geometry": {}
};

var hash = L.hash(map);
var featureGroup = L.featureGroup().addTo(map);
var drawControl = new L.Control.Draw({
    draw: {
        polyline: false,
        polygon: false,
        marker: false,
        circle: false,
        rectangle: {
            shapeOptions: {
                color: '#8FD01A',
                fillOpacity: 0.05
            },
            allowIntersection: false,
            drawError: {
                color: 'orange',
                timeout: 1000
            },
            showArea: true,
            metric: true,
            repeatMode: false
        }
    },
    edit: {
        featureGroup: featureGroup
    }
}).addTo(map);
map.on('draw:created', function(e) {
    var layer = e.layer;
    featureGroup.addLayer(layer);
    geojson.geometry = e.layer.toGeoJSON().geometry;
    geojson.properties.mapid = mapid;
    geojson.properties.token = token;
    geojson.properties.zoom = map.getZoom();
    console.log(geojson);
    document.getElementById('coordinates').innerHTML = JSON.stringify(geojson);
});

map.on('zoomend', function() {
    geojson.properties.zoom = map.getZoom();
    console.log(geojson);
    document.getElementById('coordinates').innerHTML = JSON.stringify(geojson);
});
document.getElementById("map_id").defaultValue = mapid;

map_id = document.getElementById('map_id');
map_id.addEventListener('input', function(e) {
    e.preventDefault();
  //  document.getElementById("map").innerHTML = '';
    mapid = map_id.value;
    geojson.properties.mapid = mapid;
    L.mapbox.tileLayer(mapid).addTo(map);
}, false);