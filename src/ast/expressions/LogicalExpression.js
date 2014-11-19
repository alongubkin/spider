var Node = require('../Node').Node;

exports.LogicalExpression = function (left, operator, right) {
  Node.call(this);
  
  this.type = 'LogicalExpression';
  this.operator = operator;
  
  if (this.operator === 'and') {
    this.operator = '&&';
  } else if (this.operator === 'or') {
    this.operator = '||';
  }
  
  this.left = left;
  this.left.parent = this;
  
  this.right = right;
  this.right.parent = this;
};

exports.LogicalExpression.prototype = Object.create(Node);

exports.LogicalExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var enforceBooleanExpression = function (o) {
    return {
      "type": "UnaryExpression",
      "operator": "!",
      "argument": {
        "type": "UnaryExpression",
        "operator": "!",
        "argument": o,
        "prefix": true
      },
      "prefix": true
    };
  };
  
  this.left = enforceBooleanExpression(this.left.codegen());
  this.right = enforceBooleanExpression(this.right.codegen());
  
  return this;
};

exports.LogicalExpression.prototype.hasCallExpression = function () {
  return (this.left !== null && this.left.hasCallExpression()) ||
         (this.right !== null && this.right.hasCallExpression());
};