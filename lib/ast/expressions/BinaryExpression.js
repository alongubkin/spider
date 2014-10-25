var Node = require('../Node').Node;

exports.BinaryExpression = function (left, operator, right) {
  Node.call(this);
  
  this.type = 'BinaryExpression';
  this.operator = operator;
  
  if (this.operator === '==') {
    this.operator = '===';
  } else if (this.operator === '!=') {
    this.operator = '!==';
  }
  
  this.left = left;
  this.left.parent = this;
  
  this.right = right;
  this.right.parent = this;
};

exports.BinaryExpression.prototype = Object.create(Node);

exports.BinaryExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.left = this.left.codegen();
  this.right = this.right.codegen();
  return this;
};

exports.BinaryExpression.prototype.hasCallExpression = function () {
  return (this.left !== null && this.left.hasCallExpression()) ||
         (this.right !== null && this.right.hasCallExpression());
};