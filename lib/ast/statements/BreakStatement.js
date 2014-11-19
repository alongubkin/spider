var Node = require('../Node').Node;

exports.BreakStatement = function () {
  Node.call(this);
  
  this.type = 'BreakStatement';
};

exports.BreakStatement.prototype = Object.create(Node);

exports.BreakStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};