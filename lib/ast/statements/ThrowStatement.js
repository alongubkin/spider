var Node = require('../Node').Node;

exports.ThrowStatement = function (argument) {
  Node.call(this);
  
  this.type = 'ThrowStatement';
  
  this.argument = argument;
  this.argument.parent = this;
};

exports.ThrowStatement.prototype = Object.create(Node);

exports.ThrowStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.argument = this.argument.codegen();
  return this;
};