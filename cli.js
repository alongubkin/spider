#! /usr/bin/env node

"use strict";

var vm = require("vm");
var fs = require("fs");
var chalk = require('chalk');
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
  .option("verbose", {
    abbr: "v",
    flag: true,
    help: "verbose mode"
  })  
  .option("version", {
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

function generateErrorColumnString(errorStartIndex, errorEndIndex) {
  var chars = [];
  var i = 0;
  
  if (!errorEndIndex) {
    errorEndIndex = errorStartIndex;
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
    var js = spider.compile(content, opts.verbose, errors);
    
    if (errors.length > 0) {
      console.log();
      console.log(chalk.white(fileName));
      
      var lines = content.match(/^.*([\n\r]+|$)/gm);
      errors.forEach(function (error) {
        
        var errorString = [chalk.gray("  line ", error.loc.start.line, 
                                      "  col ", error.loc.start.column), 
                           "  ", chalk.red(error.message), "\n"];
        
        if (error.loc && error.loc.start) {
          var start = error.loc.start;
          var end = error.loc.end;
          if (start.line > 0 && start.line <= lines.length) {
            errorString.push("      ");
            errorString.push(chalk.green(lines[start.line - 1].replace("\n", ""), "\n"), 
              chalk.red(generateErrorColumnString(start.column + 6, end ? end.column - 1 + 6 : 0)));
          }
        }
        
        console.log(errorString.join(""), "\n");
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