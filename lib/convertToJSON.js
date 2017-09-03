module.exports = function(file){
  var file = file || console.log("error, you must supply a file");
  var options;
  var callback;

  if (typeof arguments[1] == "object") {
    options = arguments[1];
    callback = arguments[2];
  } else if (typeof arguments[1] == "function") {
    options = {};
    callback = arguments[1];
  } else {
    options = {};
    callback = console.log;
  }

  if (options.pipeFile === undefined) {
    options.pipeFile = 'bookmarks.json';
  }
  if (options.exportToFile === undefined) {
    options.exportToFile = true;
  }

  var fs = require('fs');
  var path = require('path');
  var removeStopWords = require('./removeStopWords.js');
  var cheerio = require('cheerio');
  var marks = [];

  function readFile(file) {
    fs.readFile(file, function(err, data) {
      if (err) {
        console.log("there was a problem opening file " + err);
      }
      var fileString = data.toString(); //converting HTML files contents toString for processing
      createFile(fileString);
    });
  };

  function createFile(fileString) {
    var $ = cheerio.load(fileString);
    var titles = [];
    $('a').each(function(i, elem) {
      var title = $(this).text();
      marks[i] = {    //creating array structure to store each bookmark
        'title': title,
        'link': $(this).attr('href')
      };
      titles.push(title); //storing the titles array for checking frequency of terms
    });
    frequency(titles, marks);
  };

 function storeFile(marks) {
    if(options.exportToFile){
      fs.writeFile(options.pipeFile, marks, function(err, data) {
        if (err) {
          console.log("sorry unable to write the file to disk..." + err)
        }
        return callback(marks);
      });
    }
    else{
      return callback(marks);
    }
  };

  function frequency(titles, marks) {
    var titlesString = titles.join(' ');
    var words = titlesString.toLowerCase().match(/\w+[A-z]/g);
    var wordsString = words.join(' ');
    var wordsArrayFiltered = wordsString.removeStopWords().split(' ');
    var sortable = [];

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
    // console.log(sortable.slice().join('\n')); can be used for checking term frequency
    categorize(sortable, marks);
  };

  function categorize(sortable, marks) {
    for (var x = 0; x < sortable.length; x++) {
      for (var y = 0; y < marks.length; y++) {
        if (marks[y]['title'].toLowerCase().indexOf(sortable[x][0]) != -1) {
          marks[y]['category'] = (marks[y]['category'] || []);
          marks[y]['category'].push(sortable[x][0]);
        }
      }
    }
    marks = JSON.stringify(marks);
    // console.log(marks);
    storeFile(marks)
  };

  readFile(file);// initiate the start of the module, file parameter only to show flow

};
