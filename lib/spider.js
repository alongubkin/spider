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
    var message;
    
    if (e.expected) {
      if (e.found) {
        message = "unexpected " + e.found;
      } else {
        message = "unexpected end of input";
      }
    } else {
      message = e.message;
    }
    
    errors.push({
      message: message,
      loc: {
        start: {
          line: e.line,
          column: e.column - 1
        }
      }
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