var Node = require('./Node').Node;

exports.VariableDeclarator = function (id, init) {
  Node.call(this);
  
  this.type = 'VariableDeclarator';
  
  this.id = id;
  this.id.parent = this;
  
  this.init = init;
  
  if (this.init) {
    this.init.parent = this;
  }
};

exports.VariableDeclarator.prototype = Object.create(Node);

exports.VariableDeclarator.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  if (this.init) {
    this.init = this.init.codegen();
  }
  
  this.id = this.id.codegen();
  
  return this;
};