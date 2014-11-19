var Node = require('../Node').Node;

exports.BooleanLiteral = function (text) {
  Node.call(this);
  
  this.type = 'Literal';
  this.value = text === "true";
  this.raw = text;
};

exports.BooleanLiteral.prototype = Object.create(Node);

exports.BooleanLiteral.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};

exports.BooleanLiteral.prototype.hasCallExpression = function () {
  return false;
};