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

exports.compile = function (text, verbose, errors, sourceMap, sourceMapUrl, iifi, useStrict) {
  ast.Node.setErrorManager(new ErrorManager(errors));
  
  ast.NullPropagatingExpression.resetVariableNames();
  ast.NullCoalescingExpression.resetVariableNames();
  ast.NullCheckCallExpression.resetVariableNames();
  ast.ExistentialExpression.resetVariableNames();  
  ast.FunctionExpression.resetVariableNames();  
  ast.ForOfStatement.resetVariableNames();  
  ast.ForInExpression.resetVariableNames();  
  
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
      type: "SyntaxError",
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
    
    if (iifi || useStrict) {
      // Add ;(function () { ... })()
      var body = [];
      
      if (useStrict) {
        body.push({
          "type": "ExpressionStatement",
          "expression": {
            "type": "Literal",
            "value": "use strict;"
          }
        });
      }
      
      if (iifi) {
        body.push({
          "type": "ExpressionStatement",
          "expression": {
            "type": "CallExpression",
            "callee": {
              "type": "FunctionExpression",
              "id": null,
              "params": [],
              "defaults": [],
              "body": {
                "type": "BlockStatement",
                "body": tree.body
              },
              "rest": null,
              "generator": false,
              "expression": false
            },
            "arguments": []
          }
        });
      }
        
      tree = {
        "type": "Program",
        "body": body
      };
    }
      
    var output = escodegen.generate(tree, {
      sourceMap: sourceMap,
      sourceMapWithCode: !!sourceMap,
      format: { 
        quotes: 'double'
      }
    });
    
    var js = sourceMap ? output.code : output;
    if (sourceMap) {
      js += "\n\n//# sourceMappingURL=" + sourceMapUrl;
    }
    
    if (sourceMap) {
      output.code = js;
    } else {
      output = js;
    }
    
    if (verbose) {
      console.log(JSON.stringify(parsed, null, 4));
      console.log(js);
    }
    
    return output;
  }
};