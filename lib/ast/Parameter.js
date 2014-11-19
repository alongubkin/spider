var Node = require('./Node').Node;

exports.Parameter = function (id, defaultValue, splat) {
  Node.call(this);
  
  this.type = 'Parameter';
  this.splat = splat;
  
  this.id = id;
  this.id.parent = this;
  
  this.defaultValue = defaultValue;
  
  if (this.defaultValue) {
    this.defaultValue.parent = this;
  }
};

exports.Parameter.prototype = Object.create(Node);

exports.Parameter.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.id = this.id.codegen(false);
  
  if (this.defaultValue) {
    this.defaultValue = this.defaultValue.codegen();
    
    return {
      "type": "IfStatement",
      "test": {
        "type": "BinaryExpression",
        "operator": "==",
        "left": this.id,
        "right": {
          "type": "Literal",
          "value": null,
          "raw": "null"
        }
      },
      "consequent": {
        "type": "BlockStatement",
        "body": [{
          "type": "ExpressionStatement",
          "expression": {
            "type": "AssignmentExpression",
            "operator": "=",
            "left": this.id,
            "right": this.defaultValue
          }
        }]
      },
      "alternate": null
    };
  }
  
  return null;
};

exports.Parameter.prototype.hasCallExpression = function () {
  return false;
};

exports.Parameter.generateFunctionBody = function (fn, params, body) {
  var addToBody = [];
  var splatPosition = -1;
  
  params.forEach(function (param, i) {
    var paramBodyCode = param.codegen();
    
    if (param.splat) {
      if (splatPosition !== -1) {
        Node.getErrorManager().error({
          type: "MultipleSplatsDisallowed",
          message: "multiple splats are disallowed in a function declaration",
          loc: param.loc
        });
      }
      
      splatPosition = i;
    }
    
    params[i] = param.id;
    fn.defineIdentifier(param.id);
    
    if (paramBodyCode != null) {
      paramBodyCode.codeGenerated = true;
      addToBody.push(paramBodyCode);
    }
  });
    
  body.body = addToBody.concat(body.body);
  
  if (splatPosition !== -1) {
    var declarations = [{
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": "__splat"
      },
      "init": null
    }];
    
    params.forEach(function (param, i) {
      var init;
      if (i < splatPosition) {
        init = {
          "type": "MemberExpression",
          "computed": true,
          "object": {
            "type": "Identifier",
            "name": "arguments"
          },
          "property": {
            "type": "Literal",
            "value": i
          }
        };
      } else if (i === splatPosition) {
        init = {
          "type": "ConditionalExpression",
          "test": {
            "type": "BinaryExpression",
            "operator": "<=",
            "left": {
              "type": "Literal",
              "value": params.length
            },
            "right": {
              "type": "MemberExpression",
              "computed": false,
              "object": {
                "type": "Identifier",
                "name": "arguments"
              },
              "property": {
                "type": "Identifier",
                "name": "length" 
              }
            }
          },
          "consequent": {
            "type": "CallExpression",
            "callee": {
              "type": "MemberExpression",
              "computed": false,
              "object": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                  "type": "ArrayExpression",
                  "elements": []
                },
                "property": {
                  "type": "Identifier",
                  "name": "slice"
                }
              },
              "property": {
                "type": "Identifier",
                "name": "call"
              }
            },
            "arguments": [{
              "type": "Identifier",
              "name": "arguments"
            }, {
              "type": "Literal",
              "value": splatPosition
            }]
          },
          "alternate": {
            "type": "ArrayExpression",
            "elements": []
          }
        };
            
        if (splatPosition < params.length - 1) {
          init.consequent.arguments.push({
            "type": "AssignmentExpression",
            "operator": "=",
            "left": {
              "type": "Identifier",
              "name": "__splat"
            },
            "right": {
              "type": "BinaryExpression",
              "operator": "-",
              "left": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                  "type": "Identifier",
                  "name": "arguments"
                },
                "property": {
                  "type": "Identifier",
                  "name": "length"
                }
              },
              "right": {
                "type": "Literal",
                "value": params.length - splatPosition - 1
              }
            }
          });
          
          init.alternate = {
            "type": "SequenceExpression",
            "expressions": [{
              "type": "AssignmentExpression",
              "operator": "=",
              "left": {
                "type": "Identifier",
                "name": "__splat"
              },
              "right": {
                "type": "Literal",
                "value": splatPosition
              }
            }, {
              "type": "ArrayExpression",
              "elements": []
            }]
          };
        }
      } else {
        init = {
          "type": "MemberExpression",
          "computed": true,
          "object": {
            "type": "Identifier",
            "name": "arguments"
          },
          "property": {
            "type": "UpdateExpression",
            "operator": "++",
            "argument": {
              "type": "Identifier",
              "name": "__splat"
            },
            "prefix": false
          }
        };
      }
      
      declarations.push({
        "type": "VariableDeclarator",
        "id": param,
        "init": init
      });
    });
    
    body.body = [{
      "type": "VariableDeclaration",
      "codeGenerated": true,
      "declarations": declarations,
      "kind": "var"
    }].concat(body.body);
    
    params.length = 0;
  }
};