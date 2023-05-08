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
  zoom: 8 // starting zoom
  });

map.addControl(new maplibregl.NavigationControl(), 'top-right');

// fetch('../config/mapStyles.json')
// .then(response => response.json())
// .then(data => console.log(Object.values(data)))
// // .then(data => data.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)))
// .then(data => map.addControl(new MapLibreStyleSwitcherControl(Object.values(data), apiKey)))
// .catch(error => console.log(error));

map.addControl(new MapLibreStyleSwitcherControl(styles, apiKey))

// Create a popup, but don't add it to the map yet.
var popup = new maplibregl.Popup({
  closeButton: false
});

map.on('load', function () {

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

  const layerControl = new layerControlGrouped(config);
  document.querySelector('.sidebar').appendChild(layerControl.onAdd(map));

  // map.addControl(new MaplibreInspect({
  //   showInspectMap: false,
  //   showMapPopup: true,
  //   showInspectButton: false,
  //   queryParameters: {
  //     layers: ['Lakes']
  //   }
  // }));

  // map.on('mousemove', 'Lakes' function(e) {
  //   // Change the cursor style as a UI indicator.
  //   console.log(e.features[0]);
  //   map.getCanvas().style.cursor = 'pointer';

  //   // Single out the first found feature.
  //   var feature = e.features[0];

  //   // Display a popup with the name of the county
  //   popup.setLngLat(e.lngLat)
  //       .setText(feature.properties.name_en)
  //       .addTo(map);
  // });

  // map.on('mouseleave', 'Lakes', function() {
  //   map.getCanvas().style.cursor = '';
  //   popup.remove();
  // });
  map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point);
    // console.log(features);
    // Limit the number of properties we're displaying for
    // legibility and performance
    var displayProperties = [
      'layer',
      'properties',
    ];
    
    var displayFeatures = features.map(function (feat) {
      
      var displayFeat = {};
      
      displayProperties.forEach(function (prop) {
        // console.log(feat);
        displayFeat[prop] = feat[prop];
      });
      
      return displayFeat;
    });

    var wantedLayers = ['Lakes'];
    var wantedPopupData = {};
    
    displayFeatures.forEach(function (feature) {
      
      if (wantedLayers.includes(feature.layer.id)) {
        // console.log(feature);
        wantedPopupData[feature.layer.id] = feature.properties.name_en;
        // console.log(Object.values(wantedPopupData).length);
        
      }

    });

    // Display a popup with the wanted popup data
    if (Object.values(wantedPopupData).length) {
      console.log(wantedPopupData);
      popup.setLngLat(e.lngLat)
          .setText(JSON.stringify(wantedPopupData).replace(/[{}]/g, '').replace(/"/g, ''))
          .addTo(map);
    }
  }); // end map.on('mousemove')

  map.on('mouseleave', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });

}) // end map.on('load')
