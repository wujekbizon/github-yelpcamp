mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/wujekbizon/cl1th54rd000r14o8334wosfm', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 7, // starting zoom
});

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

new mapboxgl.Marker({
  color: '#FFA500',
})
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 20 }).setHTML(
      `
    <h5>${campground.title}</h5>
    <p>${campground.location}</p>
    `
    )
  )
  .addTo(map);
