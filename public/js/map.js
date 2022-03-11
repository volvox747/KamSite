mapboxgl.accessToken = mapToken;
console.log(campground);
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom:9,
    center: campground.geometry.coordinates
});

map.addControl(new mapboxgl.NavigationControl()); // adding map controls

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(`<h3>${campground.title}</h3>`)
    )
    .addTo(map);