var Node = require('../Node').Node;

exports.ExpressionStatement = function (expression) {
  Node.call(this);
  
  this.type = 'ExpressionStatement';
  this.expression = expression;
  this.expression.parent = this;
};

exports.ExpressionStatement.prototype = Object.create(Node);

exports.ExpressionStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.expression = this.expression.codegen();
  return this;
};