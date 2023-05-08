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
  center: [-93.291, 30.8597], // starting position [lng, lat]
  zoom: 17 // starting zoom
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

  // map.addSource('Depth', {
  //   'type': 'geojson',
  //   'data': {
  //     type: "FeatureCollection",
  //     features: []
  //   }
  // });

  map.loadImage(
    '../data/img/bluehatch.png',
    function (err, image) {
        // Throw an error if something went wrong
        if (err) throw err;
        // Declare the image
        map.addImage('bluehatch', image);
    }
  );

  map.addLayer({
    'id': '2yr Existing Depth',
    'type': 'fill',
    'source': {
      type: "geojson",
      data: "../data/westPark/2yr Existing Depth.geojson"
    },
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'fill-color': 'orange',
      'fill-outline-color': 'orange',
      'fill-opacity': 0.5
    }
  });

  map.addLayer({
    'id': '2yr Proposed Depth',
    'type': 'fill',
    'source': {
      type: "geojson",
      data: "../data/westPark/2yr Proposed Depth.geojson"
    },
    'layout': {
      'visibility': 'none'
    },
    'paint': {
      'fill-pattern': 'bluehatch',
      'fill-outline-color': 'blue',
      'fill-opacity': 0.75
    }
  });

  map.addLayer({
    'id': 'Lakes',
    'type': 'fill',
    'source': {
      type: "geojson",
      data: "../data/dev/lakes.json"
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

  // map.addLayer({
  //   'id': 'Rail',
  //   'type': 'line',
  //   'source': {
  //     type: "geojson",
  //     data: "../data/rail.geojson"
  //   },
  //   'layout': {
  //     'visibility': 'none'
  //   },
  //   'paint': {
  //     'line-color': {
  //       stops: [
  //         [0, "black"],
  //         [14, "black"],
  //         [18, "black"]
  //       ]
  //     },
  //     'line-width': 3
  //   }
  // });

  var config = {
    collapsed: false,
    // Layer order shows up in reverse on page display
    layers: [
      
      {
        id: "2yr Proposed Depth",
        hidden: false,
        parent: '2yr Proposed Depth',
        group: "Depth Extent",
        directory: "2 Year Storm Event",
        metadata: {
          source: {
            id: "2yr Proposed Depth",
            type: "geojson",
            data: "../data/westPark/2yr Proposed Depth.geojson"
          },
          lazyLoading: true
        }
      },
      {
        id: "2yr Existing Depth",
        hidden: false,
        parent: '2yr Existing Depth',
        group: "Depth Extent",
        directory: "2 Year Storm Event",
        metadata: {
          source: {
            id: "2yr Existing Depth",
            type: "geojson",
            data: "../data/westPark/2yr Existing Depth.geojson"
          },
          lazyLoading: true
        }
      },
      {
        id: "Lakes",
        hidden: false,
        group: "Hydro",
        directory: "Environment"
      },
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
