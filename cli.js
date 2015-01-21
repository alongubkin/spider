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

  fs.readFile(fileName, "utf-8", function (error, content) {
    var compilerOutput = spider.compile({
      text: content,
      fileName: fileName,
      target: opts.target,
      generateSourceMap: generateSourceMap,
      modules: 'commonjs'
    });
    
    if (compilerOutput.errors.length > 0) {
      console.log(spider.formatErrors(fileName, content, compilerOutput.errors));
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
        var Module, _module, _require;
        Module = require('module');
        sandbox.module = _module = new Module(outFileNameWithoutExtension || 'eval');
        sandbox.require = _require = function(path) {
          return Module._load(path, _module, true);
        };
        _module.filename = sandbox.__filename;
        Object.getOwnPropertyNames(require).forEach(function(r){
          if (r !== 'paths' && r !== 'arguments' && r !== 'caller') {
            _require[r] = require[r];
          }            
        })
        _require.paths = _module.paths = Module._nodeModulePaths(process.cwd()).concat(process.cwd());
        _require.resolve = function(request) {
          return Module._resolveFilename(request, _module);
        };
        _require.extensions['.spider'] = function(module, fname){
          var content = require('fs').readFileSync(fname, 'utf8');
          var src = spider.compile({
            modules: 'commonjs', 
            text: content, 
            filename: fname, 
            target: opts.target
          }).result;
          module._compile(src, fname);
        };
        vm.runInNewContext(compilerOutput.result, sandbox, fileName);
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