var Node = require('../Node').Node;

exports.ThisExpression = function () {
  Node.call(this);
  this.type = 'ThisExpression';
};

exports.ThisExpression.prototype = Object.create(Node);

exports.ThisExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};

exports.ThisExpression.prototype.hasCallExpression = function () {
  return false;
};