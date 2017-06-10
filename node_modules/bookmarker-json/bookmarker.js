#!/usr/bin/env node

var cheerio = require('cheerio'),
  args = require('commander'),
  path = require('path'),
  fs = require('fs'),
  inputStream = process.stdin,
  outputStream = process.stdout,
  $, obj = {};

args.version('0.0.3')
  .option('-f, --file <filename>','specify an input file', setupNewFileStream, 'read')
  .option('-o, --output <filename>','specify an output file', setupNewFileStream, 'write')
  .parse(process.argv);

/**
 * Setup streams
 */
function setupNewFileStream (file, type) {
  if (file) {
    if (type === 'read') {
      inputStream = fs.createReadStream(path.resolve(file));
    }

    if (type === 'write') {
      outputStream = fs.createWriteStream(path.resolve(file));
    }
  }
};

/**
 * Process data
 */
inputStream.setEncoding('utf8');
inputStream.on('readable', function () {
  var chunk = inputStream.read();
  if (chunk !== null) {
    $ = cheerio.load(chunk);

    $('a').each(function (index, element) {
      obj[index] = {
        'title': $(this).text(),
        'url': $(this).attr('href'),
        'created_at': $(this).attr('add_date'),
        'icon_data': $(this).attr('icon')
      };
    });

    outputStream.write(JSON.stringify(obj, undefined, 2));
  }
});

inputStream.on('end', function () {
  return process.exit(1);
});
