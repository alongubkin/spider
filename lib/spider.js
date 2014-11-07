/*jshint undef:false*/

var parser = require('./parser'),
    fs = require('fs'),
    escodegen = require('escodegen'),
    nodeCLI = require('shelljs-nodecli'),
    ast = require('./ast');
  
exports.compile = function (text, verbose, lint, fn) {
  ast.NullPropagatingExpression.resetVariableNames();
  ast.NullCoalescingExpression.resetVariableNames();
  ast.NullCheckCallExpression.resetVariableNames();
  ast.ExistentialExpression.resetVariableNames();  
  
  var parsed = parser.parse(text);
  var pretty = JSON.stringify(parsed, null, 4);
  var tree = parsed.codegen();
  //var pretty = JSON.stringify(tree, null, 4);
  if (verbose) {
    console.log(pretty);
  }
  
  var js = escodegen.generate(tree, {
    format: { quotes: 'double' }
  });

  if (verbose) {
    console.log(js);
  }
  
  if (lint) {
    fs.writeFile('output.js', ['"use strict";\n\n', js, '\n'].join(''), function () {
      nodeCLI.exec('eslint', '-c eslint.json output.js', {silent:true}, function (code, output) {
        fn(js, output);
      });
    });
  } else {
    fn(js);
  }
};