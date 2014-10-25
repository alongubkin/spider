var Node = require('../Node').Node;

exports.StringLiteral = function (text) {
  Node.call(this);
  
  this.type = 'Literal';
  this.value = text.substring(1, text.length - 1);
  this.raw = text;
};

exports.StringLiteral.prototype = Object.create(Node);

exports.StringLiteral.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};

exports.StringLiteral.prototype.hasCallExpression = function () {
  return false;
};