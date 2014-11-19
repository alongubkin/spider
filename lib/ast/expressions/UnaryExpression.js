var Node = require('../Node').Node;

exports.UnaryExpression = function (operator, argument) {
  Node.call(this);
  
  this.type = 'UnaryExpression';
  this.operator = operator;
  this.argument = argument;
  this.argument.parent = this;
  this.prefix = true;
};

exports.UnaryExpression.prototype = Object.create(Node);

exports.UnaryExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.argument = this.argument.codegen();
    
  // typeof operator should compile to:
  // ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  if (this.operator === 'typeof') {    
    var typeofExpression = {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
          "type": "MemberExpression",
          "computed": true,
          "object": {
            "type": "CallExpression",
            "callee": {
              "type": "MemberExpression",
              "computed": false,
              "object": {
                "type": "CallExpression",
                "callee": {
                  "type": "MemberExpression",
                  "computed": false,
                  "object": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                      "type": "ObjectExpression",
                      "properties": []
                    },
                    "property": {
                      "type": "Identifier",
                      "name": "toString"
                    }
                  },
                  "property": {
                    "type": "Identifier",
                    "name": "call"
                  }
                },
                "arguments": [this.argument]
              },
              "property": {
                "type": "Identifier",
                "name": "match"
              }
            },
            "arguments": [{
              "type": "Literal",
              "value": new RegExp("\\s([a-zA-Z]+)")
            }]
          },
          "property": {
            "type": "Literal",
            "value": 1,
            "raw": "1"
          }
        },
        "property": {
          "type": "Identifier",
          "name": "toLowerCase"
        }
      },
      "arguments": []
    };
    
    if (!this.argument.hasCallExpression()) {
      this.type = "ConditionalExpression";
      this.test = {
        "type": "BinaryExpression",
        "operator": "===",
        "left": {
          "type": "UnaryExpression",
          "operator": "typeof",
          "argument": this.argument,
          "prefix": true
        },
        "right": {
          "type": "Literal",
          "value": "undefined",
          "raw": "'undefined'"
        }
      };
      
      this.consequent = {
        "type": "Literal",
        "value": "undefined"
      };
      
      this.alternate = typeofExpression;
    } else {
      this.type = typeofExpression.type;
      this.callee = typeofExpression.callee;
      Object.defineProperty(this, 'arguments', { 
        value: typeofExpression.arguments, 
        enumerable: true 
      });
    }
  }
  
  return this;
};

exports.UnaryExpression.prototype.hasCallExpression = function () {
  return (this.argument !== null && this.argument.hasCallExpression());
};