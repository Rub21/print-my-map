var mapid = 'ruben.m3ag4lf8';
var token = 'pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig';
L.mapbox.accessToken = token;

var map = L.mapbox.map('map', mapid)
    .setView([38.88995, -77.00906], 15);

var geojson = {
    "type": "Feature",
    "properties": {
        "mapid": mapid,
        "token": token,
        "zoom": 0
    },
    "geometry": {}
};

var host = 'localhost';
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