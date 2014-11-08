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

opts.files.forEach(function (fileName) {
  fs.readFile(fileName, "utf-8", function (error, content) {
    if (error) {
      return console.log(error);
    }
    
    var js = spider.compile(content);
    
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
  });
});