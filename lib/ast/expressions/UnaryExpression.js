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
  return this;
};

exports.UnaryExpression.prototype.hasCallExpression = function () {
  return (this.argument !== null && this.argument.hasCallExpression());
};