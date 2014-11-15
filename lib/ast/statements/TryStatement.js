var Node = require('../Node').Node;

exports.TryStatement = function (block, handler, finalizer) {
  Node.call(this);
  
  this.type = 'TryStatement';
  
  this.block = block;
  this.block.parent = this;
  
  this.handler = handler;
  if (this.handler) {
    this.handler.parent = this;
  }
  
  this.finalizer = finalizer;
  if (this.finalizer) {
    this.finalizer.parent = this;
  }
};

exports.TryStatement.prototype = Object.create(Node);

exports.TryStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.block = this.block.codegen();
  
  if (this.handler) {
    this.handler = this.handler.codegen();
  }
  
  if (this.finalizer) {
    this.finalizer = this.finalizer.codegen();
  }
  
  return this;
};