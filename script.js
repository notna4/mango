mapboxgl.accessToken = 'pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [21.2087, 45.7489], // starting position [lng, lat]
    zoom: 12 // starting zoom
});

let startLat;
let startLon;
let stopLat;
let stopLon;
let link;
let coord;


document.getElementById('process').onclick = function() {
    let start = document.getElementById('start');
    let stop = document.getElementById('stop');
    
    let linkAdressStart = 'https://nominatim.openstreetmap.org/search?q=' + start.value + '&format=json&polygon=1&addressdetails=1';
    
    $.ajax({
        url: linkAdressStart,
        dataType: 'json',
        async: false,
        success: function(data) {
            startLat = data[0].lat;
            startLon = data[0].lon;
            //console.log(startLat + " " + startLon);
        }
    });

    let linkAdressStop = 'https://nominatim.openstreetmap.org/search?q=' + stop.value + '&format=json&polygon=1&addressdetails=1';


    $.ajax({
        url: linkAdressStop,
        dataType: 'json',
        async: false,
        success: function(data) {
            stopLat = data[0].lat;
            stopLon = data[0].lon;
            //console.log(startLat + " " + startLon);
        }
    });

    console.log(startLon + " start " + startLat);
    console.log(stopLon + " stop " + stopLat);
    link = "https://api.mapbox.com/directions/v5/mapbox/driving/" + startLon + "," + startLat + ";" + stopLon + "," + stopLat + "?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q";
    console.log(link);
   
    $.ajax({
        url: link,
        dataType: 'json',
        async: false,
        success: function(data) {
        coord = data.routes[0].geometry.coordinates;
        let time, hours, minutes, aux;
        aux = data.routes[0].duration / 3600;
        hours = Math.floor(data.routes[0].duration / 3600);
        minutes = Math.abs(Math.floor((hours-aux) * 60));
        let writeTime = document.getElementById('time');
        writeTime.textContent = hours + "h " + minutes + "m";

        let distance;
        distance = Math.floor(data.routes[0].distance / 1000);
        let writeKm = document.getElementById('km');
        writeKm.textContent = distance + "km";
        console.log(data.routes[0].distance);
        }
    });
    // update
    map.getSource("route").setData(
        {
            "type": "LineString",
            "coordinates": coord
        }
    )

    map.flyTo({
        // These options control the ending camera position: centered at
        // the target, at zoom level 9, and north up.
        center: coord[0],
        zoom: 17,

        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 0.4, // make the flying slow
        curve: 1, // change the speed at which it zooms out

        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: (t) => t,

        // this animation is considered essential with respect to prefers-reduced-motion
        essential: true

    });

}

document.getElementById('journey').onclick = function() {
    function bearingBetween(coordinate1, coordinate2) {
        start_latitude  = coordinate1[0];
        start_longitude = coordinate1[1];
        stop_latitude   = coordinate2[0];
        stop_longitude  = coordinate2[1];

        var y = Math.sin(stop_longitude-start_longitude) * Math.cos(stop_latitude);
        var x = Math.cos(start_latitude)*Math.sin(stop_latitude) -
                Math.sin(start_latitude)*Math.cos(stop_latitude)*Math.cos(stop_longitude-start_longitude);
        var brng = Math.atan2(y, x) * 180 / Math.PI;
        return brng;
      }

    for (let i = 0; i < coord.length; ++i) {
        setTimeout(() => {
            map.flyTo({
                // These options control the ending camera position: centered at
                // the target, at zoom level 9, and north up.
                center: coord[i],
                bearing: bearingBetween(coord[i], coord[i+1]) + 90,
                zoom: 17,
        
                // These options control the flight curve, making it move
                // slowly and zoom out almost completely before starting
                // to pan.
                speed: 0.06, // make the flying slow
                curve: 0.4, // change the speed at which it zooms out
        
                // This can be any easing function: it takes a number between
                // 0 and 1 and returns another number between 0 and 1.
                easing: (t) => t,
        
                // this animation is considered essential with respect to prefers-reduced-motion
                essential: true
        
            });
        }, 200 * i);
    }
}

map.on('load', () => {
    map.addSource('route', {
        'type': 'geojson',
        'lineMetrics': true,
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        }
    });
    map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': 'blue',
            'line-width': 10
        }
    });

});


