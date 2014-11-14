var Node = require('../Node').Node;

exports.SplatExpression = function (expression) {
  Node.call(this);
  
  this.type = 'SplatExpression';
  
  this.expression = expression;
  this.expression.parent = this;
};

exports.SplatExpression.prototype = Object.create(Node);

exports.SplatExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.expression = this.expression.codegen();
  
  return {
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
    "arguments": [this.expression]
  };
};

exports.SplatExpression.prototype.hasCallExpression = function () {
  return true;
};