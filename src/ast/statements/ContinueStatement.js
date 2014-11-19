var Node = require('../Node').Node;

exports.ContinueStatement = function () {
  Node.call(this);
  
  this.type = 'ContinueStatement';
};

exports.ContinueStatement.prototype = Object.create(Node);

exports.ContinueStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};