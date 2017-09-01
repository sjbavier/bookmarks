var defaults;
module.exports = {
  var fs = require('fs');
  var path = require('path');
  var removeStopWords = require('./removeStopWords.js');
  var cheerio = require('cheerio');
  var marks = [];
  var file =

  settings: {
    htmlBookmarks: file,

  },
  createFile: function(fileString) {
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
    this.frequency(titles, marks);
  },

  storeFile: function(marks) {
    fs.writeFile('bookmarks.json', marks, function(err, data) {
      if (err) {
        console.log("sorry unable to write the file to disk..." + err)
      }
    });
  },

  frequency: function(titles, marks) {
    var titlesString = titles.join(' ');
    var words = titlesString.toLowerCase().match(/\w+[A-z]/g);
    var wordsString = words.join(' ');
    var wordsArrayFiltered = wordsString.removeStopWords().split(' ');
    var sortable = [];

    fs.writeFile('titles.txt', wordsArrayFiltered, function(err, data) {
      if (err) {
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

    // console.log(sortable.slice().join('\n'));
    this.categorize(sortable, marks);
  }

  categorize: function(sortable, marks) {
    for (var x = 0; x < sortable.length; x++) {

      for (var y = 0; y < marks.length; y++) {

        if (marks[y]['title'].toLowerCase().indexOf(sortable[x][0]) != -1) {

          marks[y]['category'] = (marks[y]['category'] || []);
          marks[y]['category'].push(sortable[x][0]);

        }

      }

    }
    console.log(marks);
    marks = JSON.stringify(marks);
    this.storeFile(marks)
  },

  init: function(file) {
    this.settings
    fs.readFile(file, function(err, data) {
      if (err) {
        console.log("there was a problem opening file " + err);
      }
      var fileString = data.toString();
      this.createFile(fileString);
    });
  }
}
