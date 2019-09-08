//
// A function to return on top of html page
//
// IIFE - Immediately Invoked Function Expression
(function (getFrenchRegions) {
  // The global jQuery object is passed as a parameter
  getFrenchRegions(window.jQuery, window, document);
}(function ($, window, document) {
  // The $ is now locally scoped
  // Listen for the jQuery ready event on the document
  $(function () {
    // The DOM is ready!

    const regions = {
      "auvergne-rhone-alpes": "Auvergne-Rhône-Alpes",
      "bourgogne-franche-comte": "Bourgogne-Franche-Comté",
      "bretagne": "Bretagne",
      "centre-val-de-loire": "Centre-Val de Loire",
      "corse": "Corse",
      "grand-est": "Grand Est",
      "hauts-de-france": "Hauts-de-France",
      "ile-de-france": "Île-de-France",
      "normandie": "Normandie",
      "nouvelle-aquitaine": "Nouvelle-Aquitaine",
      "occitanie": "Occitanie",
      "pays-de-la-loire": "Pays de la Loire",
      "provence-alpes-cote-azur": "Provence-Alpes-Côte d'Azur",
    };

    const map = L.map('map').setView([46.866, 0.242], 6);

    const openStreetMap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>',
      maxZoom: 19
    }).addTo(map);

    const baseMap = {
      "Rendu OpenStreetMap": openStreetMap
    };

    let overlaysMaps = {};
    let requestQueue = [];

    function getOverpassUrl(region) {
        return 'http://overpass-api.de/api/interpreter?data=[out:json][timeout:300];(relation["name"="' + region + '"]["boundary"="administrative"]["admin_level"="4"];);out body geom;';
    }

    for (const [key, value] of Object.entries(regions)) {
      const requestUrl = getOverpassUrl(value);
      const request = $.get(requestUrl, function (osmDataAsJson) {
        const resultAsGeojson = osmtogeojson(osmDataAsJson);
        const mapLayer = L.geoJson(resultAsGeojson);
        mapLayer.addTo(map);
      }).promise();
      requestQueue.push(request);
    }

    Promise.all(requestQueue).then(() => {
      // all requests finished successfully
      console.log(overlaysMaps);
      L.control.layers(baseMap, overlaysMaps, {collapsed: false}).addTo(map);
      L.control.scale({imperial: false}).addTo(map);
    }).catch(() => {
      // all requests finished but one or more failed
      console.log('error');
    })

  });
  // The rest of the code goes here!

}));
