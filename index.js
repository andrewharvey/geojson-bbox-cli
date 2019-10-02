var through = require('through'),
    Combiner = require('stream-combiner'),
    geojsonStream = require('geojson-stream'),
    turfbbox = require('@turf/bbox').default;

module.exports = bbox;
module.exports.addBbox = addBbox;

function bbox(options) {
    return Combiner(geojsonStream.parse(),
        through(function(feature, callback) {
            this.queue(addBbox(feature, options));
        }),
        geojsonStream.stringify());
}

function addBbox(feature, options) {
    return Object.assign({}, feature, {
        properties: Object.assign(feature.properties, {bbox: turfbbox(feature).map((c) => { return Number(c).toFixed(4)}).join(',')})
    });
}
