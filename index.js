var bookmarks = require('bookmarker-json');
var fs = require('fs');
var path = require('path');
var file = "bookmarks.html";
// var file = process.argv[2];
var cheerio = require('cheerio');
var marks = [];


function convertJson(file, createFile) {
    fs.readFile(file, function(err, data) {
        if (err) {
            console.log("there was a problem opening file " + err);
        }
        var fileString = data.toString();
        createFile(fileString);
    });
}

function createFile(fileString) {
    var $ = cheerio.load(fileString);
    var titles = [];
    $('a').each(function(i, elem) {
        var title = $(this).text();
        marks[i] = {
            'title': title,
            'link': $(this).attr('href')
        };
        titles.push(title);
    });
    marks = JSON.stringify(marks);
    storeFile(marks);
    frequency(titles);
}

function frequency(titles) {
  var re = new RegExp('\S\w+[a-zA-Z]', 'g');
  var titlesRe = titles.join(' ').replace(re);
  fs.writeFile('titles.txt', titlesRe, function(err, data){
    if(err){
      console.log("unable to write Titles to disk" + err);
    }
  });
    var words = titles.join(' ').split(/\s+/);
    var sortable = [];
    var counts = words.reduce(function(memo, word) {
        memo[word] = (memo[word] || 0) + 1;
        return memo;
    }, {});
    for (var keyword in counts) {
        sortable.push([keyword, counts[keyword]]);
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    console.log(sortable.slice().join('\n'));
    return;
}

function storeFile(marks) {
    fs.writeFile('bookmarks.json', marks, function(err, data) {
        if (err) {
            console.log("sorry unable to write the file to disk..." + err)
        }
    });
}

convertJson(file, createFile);
