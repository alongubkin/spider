var Node = require('../Node').Node;

exports.AssignmentExpression = function (left, operator, right) {
  Node.call(this);
  
  this.type = 'AssignmentExpression';
  this.operator = operator;
  
  this.left = left;
  this.left.parent = this;
  
  this.right = right;
  this.right.parent = this;
};

exports.AssignmentExpression.prototype = Object.create(Node);

exports.AssignmentExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.left = this.left.codegen();
  this.right = this.right.codegen();
  
  return this;
};

exports.AssignmentExpression.prototype.hasCallExpression = function () {
  return (this.left !== null && this.left.hasCallExpression()) ||
         (this.right !== null && this.right.hasCallExpression());
};