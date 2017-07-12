var fs = require('fs');
var path = require('path');
var removeStopWords = require('./removeStopWords.js');
var file = "bookmarks.html";
// var file = process.argv[2];
var cheerio = require('cheerio');
var marks = [];


function convertJson(file) {
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

function storeFile(marks) {
    fs.writeFile('bookmarks.json', marks, function(err, data) {
        if (err) {
            console.log("sorry unable to write the file to disk..." + err)
        }
    });
}

function frequency(titles) {
    var titlesString = titles.join(' ');
    var words = titlesString.toLowerCase().match(/\w+[A-z]/g);
    var wordsString = words.join(' ');
    var wordsArrayFiltered = wordsString.removeStopWords().split(' ');
    var sortable = [];

    fs.writeFile('titles.txt', wordsArrayFiltered, function(err, data){
      if(err){
        console.log("unable to write Titles to disk" + err);
      }
    });

    var counts = wordsArrayFiltered.reduce(function(prev, curr) {
        prev[curr] = (prev[curr] || 0) + 1;
        return prev;
    }, {});

    for (var keyword in counts) {
        sortable.push([keyword, counts[keyword]]);
    }

    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

    console.log(sortable.slice().join('\n'));
    categorize(sortable);
}

function categorize(sortable){

}

convertJson(file);
