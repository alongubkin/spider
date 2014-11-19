var Node = require('../Node').Node;

exports.IfStatement = function (test, consequent, alternate) {
  Node.call(this);
  
  this.type = 'IfStatement';
  
  this.test = test;
  this.test.parent = this;
  
  this.consequent = consequent;
  this.consequent.parent = this;
  
  this.alternate = alternate;
  
  if (this.alternate) {
    this.alternate.parent = this;
  }
};

exports.IfStatement.prototype = Object.create(Node);

exports.IfStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.test = this.test.codegen();
  this.consequent = this.consequent.blockWrap().codegen();
  
  if (this.alternate) {
    this.alternate = this.alternate.blockWrap().codegen();
  }
  
  return this;
};