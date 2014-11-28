#! /usr/bin/env node

"use strict";

var path = require("path");
var fs = require("fs");
var chalk = require("chalk");
var vm = require("vm");
var traceur = require("traceur");
var transfer = require("multi-stage-sourcemap").transfer;
var spider = require("./lib/spider");
var nomnom = require("nomnom");

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

function generateSpace(len) {
  var chars = [];
  for (var i = 0; i < len; i++) {
    chars.push(' ');
  }
  
  return chars.join('');
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

var problems = 0;
var traceurCompiler;

if (opts.target === "ES5") {
  traceurCompiler = new traceur.NodeCompiler({
    sourceMaps: true,
    asyncFunctions: true
  });
}

if (!opts.files) {
  console.log(nomnom.getUsage());
  process.exit(0);
}

opts.files.forEach(function (fileName, fileIndex) {
  fs.readFile(fileName, "utf-8", function (error, content) {
    if (error) {
      return console.log(error);
    }
    
    var enableSourceMap = !opts['disable-source-map'];

    var errors = [];
    var outFileNameWithoutExtension = fileName.substring(0, 
          fileName.lastIndexOf('.'));    
    var outFileName = outFileNameWithoutExtension + ".js";
    var compilerOutput = spider.compile(content, opts.verbose, errors, 
      opts.compile && enableSourceMap ? path.basename(fileName) : false, outFileNameWithoutExtension + ".map", opts.target !== "ES5", opts.target !== "ES5");
    
    if (errors.length > 0) {
      var output = [];
      
      var maxCol = 0;
      var maxLine = 0;
      
      output.push(chalk.white(fileName), "\n");
      
      var lines = content.split("\n");
      var tabCharacter = "__SPIDER_TAB";
      
      errors.forEach(function (error, errorIndex) {
        var line = error.loc.start.line;
        var column = error.loc.start.column + 1;

        var lineCharCount = line.toString().length;
        var columnCharCount = column.toString().length;
        
        maxCol = Math.max(maxCol, columnCharCount);
        maxLine = Math.max(maxCol, lineCharCount);
        
        output.push(tabCharacter);
        output.push(chalk.gray("line", line));
        output.push(tabCharacter, lineCharCount);
        output.push(chalk.gray("col", column));
        output.push(tabCharacter, columnCharCount);
                                
        output.push(chalk.red(error.message), "\n");
        
        if (error.loc && error.loc.start) {
          var start = error.loc.start;
          var end = error.loc.end;
          
          if (start.line > 0 && start.line <= lines.length) {
            output.push(tabCharacter, tabCharacter, tabCharacter);
            
            output.push(chalk.green(lines[start.line - 1].replace(/(\r\n|\n|\r)/gm, ""), 
              "\n", tabCharacter, tabCharacter));
            output.push(chalk.red(generateErrorColumnString(start.column, end ? end.column - 1 : 0)));
          }
        }
        
        output.push("\n");
        
        problems++;
        
        if (problems > 0 && 
            fileIndex === opts.files.length - 1 
            && errorIndex === errors.length - 1)  {
          output.push(chalk.red(problems + (problems === 1 ? " problem" : " problems")));
        }
      });
      
      var str = output.join("");
      var tabLength = Math.max(maxLine, maxCol);
      
      for (var i = 1; i <= tabLength; i++) {
        var regex = new RegExp(tabCharacter + i, "g");
        str = str.replace(regex, generateSpace(Math.max(2 + tabLength - i, 2)));
      }
      
      console.log(str.replace(new RegExp(tabCharacter, "g"), generateSpace(2)));
    } else {
      if (opts.target === "ES5") {
        compilerOutput.code = traceurCompiler.compile(compilerOutput.code, path.basename(fileName), outFileName);
        if (opts.compile && enableSourceMap) {
          compilerOutput.map = transfer({
            toSourceMap: compilerOutput.map.toString(),
            fromSourceMap: traceurCompiler.getSourceMap().toString()
          });
        }
      }
      
      if (opts.compile) {
        var code = compilerOutput.code;
        
        fs.writeFile(outFileName, code, function (error) {
          if (error) {
            return console.log(error);
          }
        });

        if (enableSourceMap) {
          fs.writeFile(outFileNameWithoutExtension + ".map", 
            compilerOutput.map.toString(), 
            function (error) {
              if (error) {
                return console.log(error);
              }
            });
        }  
      } else {
        var sandbox = {};
        for (var key in global) {
          sandbox[key] = global[key];
        }
        sandbox.require = require;
        vm.runInNewContext(compilerOutput.code, sandbox);
      }
    }
  });
});
