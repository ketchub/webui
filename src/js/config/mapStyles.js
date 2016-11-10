export default [{
  "featureType": "administrative",
  "elementType": "all",
  "stylers": [{
    "saturation": "-100"
  }, {
    "visibility": "on"
  }]
}, {
  "featureType": "administrative.province",
  "elementType": "all",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "administrative.locality",
  "elementType": "all",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "administrative.neighborhood",
  "elementType": "all",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "administrative.land_parcel",
  "elementType": "all",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "landscape",
  "elementType": "all",
  "stylers": [{
    "saturation": -100
  }, {
    "lightness": 65
  }, {
    "visibility": "on"
  }]
}, {
  "featureType": "landscape.man_made",
  "elementType": "all",
  "stylers": [{
    "visibility": "simplified"
  }]
}, {
  "featureType": "landscape.man_made",
  "elementType": "geometry",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "landscape.man_made",
  "elementType": "geometry.fill",
  "stylers": [{
    "visibility": "off"
  }, {
    "weight": "0.01"
  }, {
    "gamma": "0.00"
  }, {
    "lightness": "-57"
  }, {
    "saturation": "-48"
  }, {
    "color": "#853a3a"
  }]
}, {
  "featureType": "landscape.man_made",
  "elementType": "geometry.stroke",
  "stylers": [{
    "visibility": "on"
  }, {
    "weight": "0.46"
  }, {
    "color": "#9c9c9c"
  }, {
    "saturation": "-36"
  }, {
    "lightness": "20"
  }]
}, {
  "featureType": "poi",
  "elementType": "all",
  "stylers": [{
    "saturation": -100
  }, {
    "lightness": "50"
  }, {
    "visibility": "on"
  }]
}, {
  "featureType": "road",
  "elementType": "all",
  "stylers": [{
    "saturation": "-100"
  }, {
    "visibility": "on"
  }]
}, {
  "featureType": "road.highway",
  "elementType": "all",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "road.arterial",
  "elementType": "all",
  "stylers": [{
    "lightness": "-33"
  }, {
    "visibility": "on"
  }, {
    "color": "#d2d2d2"
  }, {
    "saturation": "-100"
  }]
}, {
  "featureType": "road.arterial",
  "elementType": "labels.text.fill",
  "stylers": [{
    "visibility": "on"
  }, {
    "color": "#ffffff"
  }]
}, {
  "featureType": "road.arterial",
  "elementType": "labels.text.stroke",
  "stylers": [{
    "visibility": "on"
  }, {
    "color": "#919191"
  }, {
    "weight": "2.26"
  }]
}, {
  "featureType": "road.local",
  "elementType": "all",
  "stylers": [{
    "lightness": "40"
  }, {
    "visibility": "on"
  }]
}, {
  "featureType": "road.local",
  "elementType": "geometry",
  "stylers": [{
    "visibility": "on"
  }, {
    "saturation": "0"
  }, {
    "color": "#e6e6e6"
  }]
}, {
  "featureType": "road.local",
  "elementType": "geometry.fill",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "road.local",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "on"
  }, {
    "weight": "1.60"
  }]
}, {
  "featureType": "road.local",
  "elementType": "labels.text.stroke",
  "stylers": [{
    "weight": "0.01"
  }]
}, {
  "featureType": "transit",
  "elementType": "all",
  "stylers": [{
    "saturation": -100
  }, {
    "visibility": "simplified"
  }]
}, {
  "featureType": "water",
  "elementType": "geometry",
  "stylers": [{
    "hue": "#ffff00"
  }, {
    "lightness": -25
  }, {
    "saturation": -97
  }]
}, {
  "featureType": "water",
  "elementType": "labels",
  "stylers": [{
    "lightness": -25
  }, {
    "saturation": -100
  }]
}];

// export default [
//   {featureType: 'all', elementType: 'labels.text.fill', stylers:[{color:'#ffffff'}]},
//   {featureType: 'all', elementType: 'labels.text.stroke', stylers:[{color:'#000000'},{lightness:13}]},
//   // {featureType: 'administrative', elementType: 'geometry', stylers:[{visibility:off}]},
//   {featureType: 'administrative', elementType: 'geometry.fill', stylers:[{color:'#000000'}]},
//   {featureType: 'administrative', elementType: 'geometry.stroke', stylers:[{color:'#144b53'},{lightness:14},{weight:1.4}]},
//   {featureType: 'administrative', elementType: 'labels.text.fill',  stylers:[{color:'#32a591'}]},
//   // {featureType: 'administrative', elementType: 'labels', stylers:[{visibility:off}]},
//   // {featureType: 'administrative.country', elementType: 'labels', stylers:[{visibility:off}]},
//   {featureType: 'landscape', elementType: 'all', stylers:[{color:'#08304b'}]},
//   {featureType: 'landscape', elementType: 'labels', stylers:[{visibility:'off'}]},
//   {featureType: 'poi', elementType: 'geometry', stylers:[{color:'#0c4152'},{lightness:5}]},
//   {featureType: 'road.highway', elementType: 'geometry.fill', stylers:[{color:'#000000'}]},
//   {featureType: 'road.highway', elementType: 'geometry.stroke', stylers:[{color:'#0b434f'},{lightness:25}]},
//   {featureType: 'road.arterial', elementType: 'geometry.fill', stylers:[{color:'#000000'}]},
//   {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers:[{color:'#0b3d51'},{lightness:16}]},
//   {featureType: 'road.local', elementType: 'geometry', stylers:[{color:'#000000'}]},
//   {featureType: 'transit', elementType: 'all', stylers:[{color:'#146474'}]},
//   {featureType: 'water', elementType: 'all', stylers:[{color:'#c9edf6'}]}
// ];