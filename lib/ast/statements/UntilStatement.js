var Node = require('../Node').Node;

exports.UntilStatement = function (test, body) {
  Node.call(this);
  
  this.type = 'UntilStatement';
  
  this.test = test;
  this.test.parent = this;
  
  this.body = body;
  this.body.parent = this;
};

exports.UntilStatement.prototype = Object.create(Node);

exports.UntilStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.type = 'WhileStatement';
  
  this.test = {
    "type": "UnaryExpression",
    "operator": "!",
    "argument": this.test.codegen(),
    "prefix": true
  };
  
  this.body = this.body.blockWrap().codegen();
  
  return this;
};