var Node = require('../Node').Node;

exports.ReturnStatement = function (argument) {
  Node.call(this);
  
  this.type = 'ReturnStatement';
  
  this.argument = argument;
  this.argument.parent = this;
};

exports.ReturnStatement.prototype = Object.create(Node);

exports.ReturnStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.argument = this.argument.codegen();
  return this;
};