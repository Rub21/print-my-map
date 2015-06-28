var mapid = 'ruben.mfmld567';
var token = 'pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig';
L.mapbox.accessToken = token;

var map = L.mapbox.map('map', mapid)
    .setView([38.88995, -77.00906], 15);


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
    console.log( L.GeometryUtil.geodesicArea(layer.getLatLngs()))
    featureGroup.addLayer(layer);

    var json = e.layer.toGeoJSON();

    json.properties.mapid = mapid;
    json.properties.token = token;
    json.properties.zoom =  map.getZoom();
    console.log(json)
    document.getElementById('coordinates').innerHTML = JSON.stringify(json);


});