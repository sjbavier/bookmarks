bookmarker-json
===============

Nifty tool that converts Chrome-exported bookmarks to a JSON file

### Basic usage:
```
$ ./node bookmarker.js -f bookmarks.html -o output.json
```

#### Install globally
```
$ npm install -g bookmarker-json

$ bookmarker-json ./bookmarks.html -o file.json
```

### Alternatively use STDIN and STDOUT to parse data:
```
$ cat bookmarks.html | node ./bookmarker.js > output.json
```
