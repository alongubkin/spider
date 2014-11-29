#! /usr/bin/env node

"use strict";

var fs = require("fs"),
    path = require("path"),
    vm = require("vm"),
    traceur = require("traceur"),
    nomnom = require("nomnom"),
    chalk = require("chalk"),
    spider = require("./lib/spider");

var opts = nomnom
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
  .option("disable-source-map", {
    flag: true,
    help: "disable source map files (.map) generation"
  })
  .option("target", {
    choices: ["ES6", "ES5"],
    default: "ES5",
    help: "target"
  })
  .option("version", {
    flag: true,
    help: "display the version number",
    callback: function () {
      return "version " + require("./package.json").version;
    }
  })
  .parse();

if (!opts.files) {
  console.log(nomnom.getUsage());
  process.exit(0);
}

var generateSourceMap = !opts['disable-source-map'] && opts.compile;
var problems = 0;

opts.files.forEach(function (fileName, fileIndex) {
  var baseName = path.basename(fileName);

  fs.readFile(baseName, "utf-8", function (error, content) {
    var compilerOutput = spider.compile({
      text: content,
      fileName: baseName,
      target: opts.target,
      generateSourceMap: generateSourceMap
    });
    
    if (compilerOutput.errors.length > 0) {
      console.log(spider.formatErrors(baseName, content, compilerOutput.errors));
      problems += compilerOutput.errors.length;
      
      if (problems > 0 && 
          fileIndex === opts.files.length - 1)  {
        console.log(chalk.red(problems + (problems === 1 ? " problem" : " problems")));
      }      
    } else {
      if (opts.compile) {
        var outFileNameWithoutExtension = fileName.substring(0, 
          fileName.lastIndexOf('.'));    
          
        writeFile(outFileNameWithoutExtension + ".js", 
          compilerOutput.result);
            
        if (generateSourceMap) {
          writeFile(outFileNameWithoutExtension + ".map", 
            compilerOutput.result);
        }
      } else {
        var sandbox = {};
        for (var key in global) {
          sandbox[key] = global[key];
        }
        sandbox.require = require;
        vm.runInNewContext(compilerOutput.result, sandbox);
      }
    }
  });
});

function writeFile(fileName, content) {
  fs.writeFile(fileName, content, function (error) {
    if (error) {
      return console.log(error);
    }
  });
}