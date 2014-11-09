var Node = require('./Node').Node;

exports.Property = function (key, value) {
  Node.call(this);
  
  this.type = 'Property';
  this.kind = 'init';
  
  this.key = key;
  this.key.parent = this;
  
  this.value = value;
  this.value.parent = this;
};

exports.Property.prototype = Object.create(Node);

exports.Property.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.key = this.key.codegen(false);
  this.value = this.value.codegen();
  
  return this;
};

exports.Property.prototype.hasCallExpression = function () {
  return this.value.hasCallExpression();
};