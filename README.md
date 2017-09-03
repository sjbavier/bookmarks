# bookmarks-to-json-categorization
Converts bookmarks from HTML Google Chrome export into a JSON file with simplistic categorization.

Designed for node.js and installable via ```npm install --save bookmarks-to-json-categorization -g```

Usage:

With one parameter and no callback your output is sent to bookmarks.json file and console.log.
```javascript
const bookmarks = require('bookmarks-to-json-categorization');
bookmarks('bookmarks.html');
```


You also have two options for second parameter as well as callback function.
```javascript
bookmarks('bookmarks.html', options = { pipeFile: 'bookmarks.json', exportToFile: true}, callback(data){
  //  do some things here with data
});
```

Options are optional and defaulted to value in code example above.
```javascript
bookmarks('bookmarks.html', callback(data){
  // do some things here with data
});
```
