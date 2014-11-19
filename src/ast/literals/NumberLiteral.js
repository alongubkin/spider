var Node = require('../Node').Node;

exports.NumberLiteral = function (text) {
  Node.call(this);
  
  this.type = 'Literal';
  this.value = Number(text);
  this.raw = text;
};

exports.NumberLiteral.prototype = Object.create(Node);

exports.NumberLiteral.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};

exports.NumberLiteral.prototype.hasCallExpression = function () {
  return false;
};