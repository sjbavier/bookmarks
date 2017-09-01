
var convertToJSON = require('./lib/convertToJSON.js');
var path = require('path');
// var file = process.argv[2];
exports.bookmarkTools = convertToJSON(file);
convertToJson('bookmarks_8_31_17.html',
{
  pipeFile: 'bookmarks2.json'
});
