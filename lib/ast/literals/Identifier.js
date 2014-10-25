var Node = require('../Node').Node;

exports.Identifier = function (name) {
  Node.call(this);
  
  this.type = 'Identifier';
  
  Object.defineProperty(this, 'name', { 
    value: name, 
    enumerable: true 
  });
};

exports.Identifier.prototype = Object.create(Node);

exports.Identifier.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};

exports.Identifier.prototype.hasCallExpression = function () {
  return false;
};