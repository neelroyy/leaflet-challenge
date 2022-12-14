//Using Leaflet, create a map that plots all the earthquakes 
//from your dataset based on their longitude and latitude.
var myMap = L.map("map", {
    center: [39, -98], //geographic center of the us
    zoom: 2
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

d3.json(url).then(function(data) {
    L.geoJSON(data, {onEachFeature: addPopups, pointToLayer: changeMarkers}).addTo(myMap);

});

function addPopups(feature, layer) {
//Include popups that provide additional information about the earthquake when its associated marker is clicked.
    layer.bindPopup(feature.properties.title);  
};

function getColor(depth) {
    let color = '#FF5F65';
    if (depth < 10) {
        color = '#A3F600';
    } else if (depth < 30) {
        color = '#DCF400';
    } else if (depth < 50) {
        color = '#F7DB11';
    } else if (depth < 70) {
        color = '#FDB72A';
    } else if (depth < 90) {
        color = '#FCA35D';
    };  
    return color
}

function changeMarkers(feature, latlng) {
//Your data markers should reflect:
// the magnitude of the earthquake by their size, higher = larger
// the depth of the earthquake by color, deeper = darker.
    let size = feature.properties.mag;
    let depth = feature.geometry.coordinates[2];
    var geojsonMarkerOptions = {
        radius: size*4,
        fillColor: getColor(depth),
        color: getColor(depth),
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };
    return L.circleMarker(latlng, geojsonMarkerOptions)
};

//Create a legend that will provide context for your map data.
var legend = L.control({position: 'bottomright'});
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    let limits = [-10, 10, 30, 50, 70, 90]
    var LegendInfo = "<h3>Depth Color Indicators</h3>";
    let labels = []
    div.innerHTML = LegendInfo;
    for (let i = 0; i< limits.length; i++) {
        labels.push("<p style='background-color:" + getColor(limits[i]) + "'>" + limits[i] + " to " + limits[i+1] + "</p>")
    };
    labels[5] = labels[5].replace(' to undefined', '+');
    div.innerHTML += labels.join("");
    div.innerHTML;
    return div;
};
   
legend.addTo(myMap); 

