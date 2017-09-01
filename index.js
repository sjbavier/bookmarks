
var convertToJSON = require('./lib/convertToJSON.js');
var file = process.argv[2];
exports.bookmarkTools = convertToJSON(file);
