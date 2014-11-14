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
      message: e.message,
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
    
    if (iifi) {
      // Add ;(function () { ... })()
      tree = {
        "type": "Program",
        "body": [
          { "type": "EmptyStatement" },
          {
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
          }
        ]
      };
    }
      
    var output = escodegen.generate(tree, {
      sourceMap: sourceMap,
      sourceMapWithCode: !!sourceMap,
      format: { 
        quotes: 'double'
      }
    });
    
    var finalCode = [useStrict ? '"use strict";\n\n' : '', sourceMap ? output.code : output];
    
    if (sourceMap) {
      finalCode.push("\n\n", "//# sourceMappingURL=", sourceMapUrl);
    }
    
    var js = finalCode.join('');
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