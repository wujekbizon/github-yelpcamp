mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'cluster-map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-103.5917, 40.6699],
  zoom: 3,
});

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

// Load custom data to supplement the search results.
const customData = {
  features: [
    {
      type: 'Feature',
      properties: {
        title: 'Grizzly Bay best campground',
      },
      geometry: {
        coordinates: [-118.1937395, 33.7700504],
        type: 'Point',
      },
    },
    {
      type: 'Feature',
      properties: {
        title: 'Tumbling Creekside best campground',
      },
      geometry: {
        coordinates: [-74.0323626, 40.7439905],
        type: 'Point',
      },
    },
    {
      type: 'Feature',
      properties: {
        title: 'Silent Camp best campground',
      },
      geometry: {
        coordinates: [-80.8075537, 28.6122187],
        type: 'Point',
      },
    },
  ],
  type: 'FeatureCollection',
};

function forwardGeocoder(query) {
  const matchingFeatures = [];
  for (const feature of customData.features) {
    // Handle queries with different capitalization
    // than the source data by calling toLowerCase().
    if (feature.properties.title.toLowerCase().includes(query.toLowerCase())) {
      // Add a tree emoji as a prefix for custom
      // data results using carmen geojson format:
      // https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
      feature['place_name'] = `🏕️ ${feature.properties.title}`;
      feature['center'] = feature.geometry.coordinates;
      feature['place_type'] = ['campground'];
      matchingFeatures.push(feature);
    }
  }
  return matchingFeatures;
}

map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    localGeocoder: forwardGeocoder,
    zoom: 14,
    placeholder: 'Find the best Camp',
    mapboxgl: mapboxgl,
  }),
  'bottom-left'
);

map.on('load', () => {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  map.addSource('campgrounds', {
    type: 'geojson',
    // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    data: campgrounds,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#40739e',
        10,
        '#686de0',
        45,
        '#30336b',
      ],
      'circle-radius': ['step', ['get', 'point_count'], 15, 10, 25, 45, 30],
    },
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#5bc0de',
      'circle-radius': 5,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#292b2c',
    },
  });

  // inspect a cluster on click
  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    });
    const clusterId = features[0].properties.cluster_id;
    map
      .getSource('campgrounds')
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  });

  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on('click', 'unclustered-point', (e) => {
    const { popUpMarkup } = e.features[0].properties;
    const coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
  });

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });
});
