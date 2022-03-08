mapboxgl.accessToken = mapToken;
console.log(campground);
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom:9,
    center: campground.geometry.coordinates
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map);