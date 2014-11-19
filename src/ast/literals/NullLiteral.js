var Node = require('../Node').Node;

exports.NullLiteral = function () {
  Node.call(this);
  
  this.type = 'Literal';
  this.value = null;
  this.raw = "null";
};

exports.NullLiteral.prototype = Object.create(Node);

exports.NullLiteral.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};

exports.NullLiteral.prototype.hasCallExpression = function () {
  return false;
};