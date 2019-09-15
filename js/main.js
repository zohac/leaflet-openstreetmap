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
      "auvergne-rhone-alpes.min": "Auvergne-Rhône-Alpes",
      "bourgogne-franche-comte.min": "Bourgogne-Franche-Comté",
      "bretagne.min": "Bretagne",
      "centre-val-de-loire.min": "Centre-Val de Loire",
      "grand-est.min": "Grand Est",
      "hauts-de-france.min": "Hauts-de-France",
      "ile-de-france.min": "Île-de-France",
      "normandie.min": "Normandie",
      "nouvelle-aquitaine.min": "Nouvelle-Aquitaine",
      "occitanie.min": "Occitanie",
      "pays-de-la-loire.min": "Pays de la Loire",
      "provence-alpes-cote-azur.min": "Provence-Alpes-Côte d'Azur",
      "corse.min": "Corse",
      // "auvergne-rhone-alpes": "Auvergne-Rhône-Alpes",
      // "bourgogne-franche-comte": "Bourgogne-Franche-Comté",
      // "bretagne": "Bretagne",
      // "centre-val-de-loire": "Centre-Val de Loire",
      // "grand-est": "Grand Est",
      // "hauts-de-france": "Hauts-de-France",
      // "ile-de-france": "Île-de-France",
      // "normandie": "Normandie",
      // "nouvelle-aquitaine": "Nouvelle-Aquitaine",
      // "occitanie": "Occitanie",
      // "pays-de-la-loire": "Pays de la Loire",
      // "provence-alpes-cote-azur": "Provence-Alpes-Côte d'Azur",
      // "corse": "Corse",
      // "regions": "regions",
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

    for (const [key, value] of Object.entries(regions)) {
      const request = $.get(`geoJSON/${key}.geojson`, function (region) {
        // let resultAsGeojson = osmtogeojson(osmDataAsJson);
        const mapLayer = L.geoJson(region, {
          filter: function (feature, layer) {
            return "Point" !== feature.geometry.type;
          }
        });
        mapLayer.addTo(map);
        mapLayer.setStyle({
          color: '#61ab27',
          fillOpacity: 0.3
        });
        mapLayer.on('mouseover', function highlightFeature(e) {
          let layer = e.target;

          layer.setStyle({
            color: '#03a9f4',
            fillOpacity: 0.7
          });

          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
          }
        });
        mapLayer.on('mouseout', function highlightFeature(e) {
          let layer = e.target;

          layer.setStyle({
            color: '#61ab27',
            fillOpacity: 0.3
          });

          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
          }
        });

        mapLayer.on('click', function(e){
          let layer = e.target;

          console.log(value);
        });
        overlaysMaps[`Région ${value}`] = mapLayer;
      }).promise();
      requestQueue.push(request);
    }

    Promise.all(requestQueue).then(() => {
      // all requests finished successfully
      L.control.layers(baseMap, overlaysMaps, {collapsed: false}).addTo(map);
      L.control.scale({imperial: false}).addTo(map);
    }).catch(() => {
      // all requests finished but one or more failed
      console.log('error');
    });

  });
  // The rest of the code goes here!

}));
