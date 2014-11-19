var Node = require('../Node').Node;

exports.ConditionalExpression = function (test, consequent, alternate) {
  Node.call(this);
  
  this.type = 'ConditionalExpression';
  
  this.test = test;
  this.test.parent = this;
  
  this.consequent = consequent;
  this.consequent.parent = this;
  
  this.alternate = alternate;
  this.alternate.parent = this;
};

exports.ConditionalExpression.prototype = Object.create(Node);

exports.ConditionalExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.test = this.test.codegen();
  this.consequent = this.consequent.codegen();
  this.alternate = this.alternate.codegen();
  
  return this;
};

exports.ConditionalExpression.prototype.hasCallExpression = function () {
  return true;
};