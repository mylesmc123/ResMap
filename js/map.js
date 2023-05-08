import MapLibreStyleSwitcherControl from './MapStyleSwitcher.js'
import layerControlSimple from './layerControlSimple.js'
import layerControlGrouped from './layerControlGrouped.js'


const apiKey = 'G28Wx0TEh00gRJifwBmD'
  // https://cloud.maptiler.com/maps/
  // https://github.com/maplibre/demotiles
var styles = [
    {
      title: "Topo",
      uri:
        "https://api.maptiler.com/maps/topo-v2/style.json?key=" +
        apiKey,
    },
    {
      title: "Satellite",
      uri:
        "https://api.maptiler.com/maps/hybrid/style.json?key=" +
        apiKey,
    },
    {
      title: "Toner",
      uri:
        "https://api.maptiler.com/maps/toner-v2/style.json?key=" +
        apiKey,
    },
    {
      title: "Voyager",
      uri:
        "https://tiles.basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
    },
    {
      title: "Positron",
      uri:
        "https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    },
    {
      "uri": "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      "title": "Dark Matter"
    },
  ];

  styles.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))

var map = new maplibregl.Map({
  container: 'map',
  style: 'https://api.maptiler.com/maps/hybrid/style.json?key=' + apiKey, // stylesheet location
  center: [-93.290, 30.8597], // starting position [lng, lat]
  zoom: 16 // starting zoom
  });

map.addControl(new maplibregl.NavigationControl(), 'top-right');

// fetch('../config/mapStyles.json')
// .then(response => response.json())
// .then(data => console.log(Object.values(data)))
// // .then(data => data.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)))
// .then(data => map.addControl(new MapLibreStyleSwitcherControl(Object.values(data), apiKey)))
// .catch(error => console.log(error));

map.addControl(new MapLibreStyleSwitcherControl(styles, apiKey))

map.on('load', function () {
  map.addSource('maine', {
    'type': 'geojson',
    'data': {
    'type': 'Feature',
    'geometry': {
    'type': 'Polygon',
    'coordinates': [
    [
    [-67.13734351262877, 45.137451890638886],
    [-66.96466, 44.8097],
    [-68.03252, 44.3252],
    [-69.06, 43.98],
    [-70.11617, 43.68405],
    [-70.64573401557249, 43.090083319667144],
    [-70.75102474636725, 43.08003225358635],
    [-70.79761105007827, 43.21973948828747],
    [-70.98176001655037, 43.36789581966826],
    [-70.94416541205806, 43.46633942318431],
    [-71.08482, 45.3052400000002],
    [-70.6600225491012, 45.46022288673396],
    [-70.30495378282376, 45.914794623389355],
    [-70.00014034695016, 46.69317088478567],
    [-69.23708614772835, 47.44777598732787],
    [-68.90478084987546, 47.184794623394396],
    [-68.23430497910454, 47.35462921812177],
    [-67.79035274928509, 47.066248887716995],
    [-67.79141211614706, 45.702585354182816],
    [-67.13734351262877, 45.137451890638886]
    ]
    ]
    }
    }
    });
  map.addLayer({
    'id': 'maine',
    'type': 'fill',
    'source': 'maine',
    'layout': {},
    'paint': {
    'fill-color': '#088',
    'fill-opacity': 0.8
    }
  })

  map.addSource('counties', {
    'type': 'geojson',
    'data': {
      type: "FeatureCollection",
      features: []
    }
  });

  map.addLayer({
    'id': 'counties-outline',
    'type': 'line',
    'source': 'counties',
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'line-color': 'white',
      'line-opacity': 0.5
    }
  });

  map.addLayer({
    'id': 'Counties',
    'type': 'fill',
    'source': 'counties',
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'fill-color': 'lightgray',
      'fill-outline-color': 'white',
      'fill-opacity': 0.9
    }
  });

  map.addLayer({
    'id': 'states-fill',
    'type': 'fill',
    'source': {
      type: "geojson",
      data: "../data/states.min.geojson"
    },
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'fill-color': '#121212',
      'fill-opacity': 0.3
    }
  });

  map.addLayer({
    'id': 'states-outline',
    'type': 'line',
    'source': {
      type: "geojson",
      data: "../data/states.min.geojson"
    },
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'line-color': '#121212',
      'line-opacity': 0.6
    }
  });

  map.addLayer({
    'id': 'States',
    'type': 'line',
    'source': {
      type: "geojson",
      data: "../data/states.geojson"
    },
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'line-color': '#121212',
    }
  });

  map.addLayer({
    'id': 'Lakes',
    'type': 'fill',
    'source': {
      type: "geojson",
      data: "../data/lakes.json"
    },
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'fill-color': 'blue',
      'fill-outline-color': 'white',
      'fill-opacity': 0.9
    }
  });

  map.addSource('rivers', {
    type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    })

  map.addLayer({
    'id': 'riversCase',
    'type': 'line',
    'source': 'rivers',
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'line-color': 'white',
      'line-width': 6
    }
  });

  map.addLayer({
    'id': 'rivers',
    'type': 'line',
    'source': 'rivers',
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'line-color': 'blue',
      'line-width': 3
    }
  });

  map.addLayer({
    'id': 'Rail',
    'type': 'line',
    'source': {
      type: "geojson",
      data: "../data/rail.geojson"
    },
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'line-color': {
        stops: [
          [0, "black"],
          [14, "black"],
          [18, "black"]
        ]
      },
      'line-width': 3
    }
  });

  var config = {
    collapsed: false,
    layers: [
    {
        id: "counties-outline",
        hidden: true,
        parent: 'Counties',
        group: "Cadastral",
        directory: "Admin",
        metadata: {
          source: {
            id: "counties",
            type: "geojson",
            data: "../data/counties.min.geojson"
          },
          lazyLoading: true
        }
      },
      {
        id: "Counties",
        hidden: false,
        children: true,
        group: "Cadastral",
        directory: "Admin",
        metadata: {
          source: {
            id: "counties",
            type: "geojson",
            data: "../data/counties.min.geojson"
          },
          lazyLoading: true
        }
      },
      {
        id: "states-fill",
        parent: "States",
        hidden: true,
        group: "Political",
        directory: "Admin"
      },
      {
        id: "States",
        hidden: false,
        children: true,
        group: "Political",
        directory: "Admin",
        metadata: {
          filterSchema: {
            "NAME": {
              type: "string"
            },
            "date_joined_formatted": {
              type: "date"
            }
          }
        }
      },
      {
        id: "Lakes",
        hidden: false,
        group: "Hydro",
        directory: "Environment"
      },
      {
        id: "riversCase",
        hidden: true,
        group: "Hydro",
        parent: "rivers",
        directory: "Environment",
        metadata: {
          lazyLoading: true,
          source: {
            id: "rivers",
            type: "geojson",
            data: 'rivers.geojson'
          },
        }
      },
      {
        name: "Rivers",
        id: "rivers",
        hidden: false,
        group: "Hydro",
        children: true,
        directory: "Environment",
        metadata: {
          filterSchema: {
            "name": {
              type: "select",
              options: ["", "Colorado"]
            },
            "scalerank": {
              "type": "number"
            }
          },
          lazyLoading: true
        }
      },
      {
        id: "Rail",
        hidden: false,
        directory: "Cultural",
        legend: "<icon class='fa fa-minus' style='color:red;'></icon> Legend defined in config<br><icon class='fa fa-minus' style='color:black;'></icon> Toggles when layer is off"
      }
    ]
  }

  // map.addControl(new layerControlGrouped(config));

  const layerControl = new layerControlGrouped(config);
  document.querySelector('.sidebar').appendChild(layerControl.onAdd(map));

})
