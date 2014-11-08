/*jshint undef:false*/

var parser = require('./parser'),
    escodegen = require('escodegen'),
    ast = require('./ast');
  
function ErrorManager(errors) {
  this.errors = errors;
}

ErrorManager.prototype.error = function (e) {
  this.errors.push(e);
};

exports.compile = function (text, verbose, errors) {
  ast.Node.setErrorManager(new ErrorManager(errors));
  
  ast.NullPropagatingExpression.resetVariableNames();
  ast.NullCoalescingExpression.resetVariableNames();
  ast.NullCheckCallExpression.resetVariableNames();
  ast.ExistentialExpression.resetVariableNames();  
  
  var parsed;
  
  try {
    parsed = parser.parse(text);
  } catch (e) {
    errors.push({
      message: "unexpected " + e.found,
      line: e.line,
      column: e.column,
      offset: e.offset
    });
  }
  
  if (parsed) {
    var tree = parsed.codegen();
    
    var js = escodegen.generate(tree, {
      format: { quotes: 'double' }
    });

    if (verbose) {
      console.log(JSON.stringify(parsed, null, 4));
      console.log(js);
    }
    
    return js;
  }
};