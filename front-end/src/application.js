const leaflet = require('leaflet')
const esri = require('esri-leaflet')
const axios = require('axios')
const geojson = require('geojson')

// Layers
function getLayers () {
  var callback = function (response) {
    let data = response.males
    let poblation = geojson.parse(data, {Point: ['lat', 'lng']})
    let males = leaflet.geoJSON(poblation, {onEachFeature: onEachFeature}).addTo(map)

    data = response.females
    poblation = geojson.parse(data, {Point: ['lat', 'lng']})
    let females = leaflet.geoJSON(poblation, {onEachFeature: onEachFeature}).addTo(map)

    addControlLayers(males, females)
  }

  axios.get('http://localhost:3000/api/data')
  .then(response => callback(response.data))
  .catch(error => console.log(error))
}

// Popup configuration
function onEachFeature (feature, layer) {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name)
  }
}

// Control layers
function addControlLayers (males, females) {
  let controlLayers = leaflet.control.layers().addTo(map)

  controlLayers.addOverlay(males, 'Males')
  controlLayers.addOverlay(females, 'Females')
}

// Map configuration
let map = leaflet.map('root').setView([40.25, 3.41], 5)
esri.basemapLayer('DarkGray').addTo(map)

getLayers()
