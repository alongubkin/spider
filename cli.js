#! /usr/bin/env node

"use strict";

var vm = require("vm");
var fs = require("fs");
var spider = require("./lib/spider");

var opts = require("nomnom")
  .option("files", {
    position: 0,
    help: "files to compile",
    list: true
  })
  .option("compile", {
    abbr: "c",
    flag: true,
    help: "compile to JavaScript and save as .js files"
  })
  .option("version", {
    abbr: "v",
    flag: true,
    help: "display the version number",
    callback: function () {
      return "version " + require("./package.json").version;
    }
  })
  .parse();

var context;

if (!opts.compile) {
  context = vm.createContext(global);
}

function generateErrorColumnString(offset, column) {
  var chars = [];
  var i = 0;
  
  var errorStartIndex = offset;
  var errorEndIndex = column;
  
  if (offset > column) {
    errorStartIndex = column - 1;
    errorEndIndex = column - 1;
  }
  
  for (; i < errorStartIndex; i++) {
    chars.push(' ');
  }
  
  for (i = errorStartIndex; i <= errorEndIndex; i++) {
    chars.push('^');
  }
  
  return chars.join('');
}

opts.files.forEach(function (fileName) {
  fs.readFile(fileName, "utf-8", function (error, content) {
    if (error) {
      return console.log(error);
    }
    
    var errors = [];
    var js = spider.compile(content, false, errors);
    
    if (errors.length > 0) { 
      var lines = content.match(/^.*([\n\r]+|$)/gm);
      errors.forEach(function (error) {
        var errorString = [fileName, ":", error.line, ":", error.column, ": error: ", error.message, "\n"];
        
        // append line
        if (error.line > 0 && error.line < lines.length) {
          errorString.push(lines[error.line - 1].replace("\n", ""), "\n", 
            generateErrorColumnString(error.offset, error.column));
        }
        
        console.log(errorString.join(""));
      });
    } else {
      if (opts.compile) {
        var outFileName = fileName.substring(0, 
          fileName.lastIndexOf('.')) + ".js";
        fs.writeFile(outFileName, js, function (error) {
          if (error) {
            return console.log(error);
          }
        });
      } else {
        vm.runInContext(js, context);
      }
    }
  });
});