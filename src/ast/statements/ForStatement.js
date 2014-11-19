var Node = require('../Node').Node;

exports.ForStatement = function (init, test, update, body) {
  Node.call(this);
  
  this.type = 'ForStatement';
  
  this.init = init;
  
  if (this.init) {
    this.init.parent = this;
  }
  
  this.test = test;
  
  if (this.test) {
    this.test.parent = this;
  }

  this.update = update;
  
  if (this.update) {
    this.update.parent = this;
  }
  
  this.body = body;
  this.body.parent = this;
};

exports.ForStatement.prototype = Object.create(Node);

exports.ForStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  if (this.init) {
    this.init = this.init.codegen();
  }
  
  if (this.test) {
    this.test = this.test.codegen();
  }
  
  if (this.update) {
    this.update = this.update.codegen();
  }
  
  this.body = this.body.blockWrap().codegen();
  
  return this;
};