    var mapid = 'ruben.mfmld567';
    var token = 'pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig';
    L.mapbox.accessToken = token;

    // var l_tiger = L.mapbox.tileLayer(mapid, {
    //         id: 'tig'
    //     }),
    //     l_forest = L.tileLayer('http://osm.cycle.travel/forest/{z}/{x}/{y}.png', {
    //         id: 'for',
    //         attribution: '<div class="atr_l" id="forest"></div>'
    //     }),
    //     l_osm = L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         id: 'osm',
    //         attribution: '<div class="atr_l" id="osm"></div>'
    //     });
    // var layers = {
    //     'Tiger': l_tiger,
    //     'The US Forest Service data': l_forest,
    //     'OSM.org': l_osm
    // };
    // var map = L.mapbox.map('map', null, {
    //     center: new L.LatLng(38.8929, -100.0252),
    //     zoom: 4
    // });
    // layers['Tiger'].addTo(map);

    // L.control.layers(layers).addTo(map);

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
        featureGroup.addLayer(layer);
        var json = e.layer.toGeoJSON();


        json.properties.mapid = mapid;
        json.properties.token = token;
        console.log(json)
        document.getElementById('coordinates').innerHTML = JSON.stringify(json);


    });


    var record = document.querySelector('#butto_imagen');
    record.addEventListener('click', function(e) {
        e.preventDefault();

        var json = document.querySelector('#coordinates').textContent;
        console.log(json);


        leafletImage(map, doImage);

        function doImage(err, canvas) {
            var img = document.createElement('images');
            var dimensions = map.getSize();
            img.width = dimensions.x;
            img.height = dimensions.y;
            img.src = canvas.toDataURL();
            snapshot.innerHTML = '';
            snapshot.appendChild(img);
        }
        console.log(map.getSize())

    }, false);