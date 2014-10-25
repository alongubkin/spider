var Node = require('../Node').Node;

exports.UpdateExpression = function (argument, operator, prefix) {
  Node.call(this);
  
  this.type = 'UpdateExpression';
  this.operator = operator;
  this.prefix = prefix;
  
  this.argument = argument;
  this.argument.parent = this;
};

exports.UpdateExpression.prototype = Object.create(Node);

exports.UpdateExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};

exports.UpdateExpression.prototype.hasCallExpression = function () {
  return (this.argument !== null && this.left.hasCallExpression());
};