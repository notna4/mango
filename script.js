mapboxgl.accessToken = 'pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [21.2087, 45.7489], // starting position [lng, lat]
    zoom: 12 // starting zoom
});

let link = "https://api.mapbox.com/directions/v5/mapbox/driving/21.20502563319755%2C45.745767215564854%3B21.236845905642525%2C45.75903481841323?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q";
let coord;
$.getJSON(link, function(data) {
    // JSON result in `data` variable
    coord = data.routes[0].geometry.coordinates;
    console.log(coord);
});

function allCoord() {
    let i = -1;
    while(i < coord.length) {
        i++;
        return coord[i];
    }
}

map.on('load', () => {
    map.addSource('route', {
        'type': 'geojson',
        'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': [

                ]
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
            'line-color': '#888',
            'line-width': 8
        }
    });
});