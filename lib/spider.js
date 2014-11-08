/*jshint undef:false*/

var parser = require('./parser'),
    escodegen = require('escodegen'),
    ast = require('./ast');
  
exports.compile = function (text, verbose) {
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
  
  return js;
};