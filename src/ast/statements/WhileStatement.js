var Node = require('../Node').Node;

exports.WhileStatement = function (test, body) {
  Node.call(this);
  
  this.type = 'WhileStatement';
  
  this.test = test;
  this.test.parent = this;
  
  this.body = body;
  this.body.parent = this;
};

exports.WhileStatement.prototype = Object.create(Node);

exports.WhileStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.test = this.test.codegen();
  this.body = this.body.blockWrap().codegen();
  
  return this;
};