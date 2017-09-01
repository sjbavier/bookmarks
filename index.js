
var convertToJSON = require('./lib/convertToJSON.js');
// var file = process.argv[2];
exports.bookmarkTools = convertToJSON.init;
convertToJson.init('bookmarks_8_31_17.html',
{
  pipeFile: 'bookmarks2.json'
});
