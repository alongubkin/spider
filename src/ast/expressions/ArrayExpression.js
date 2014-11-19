var Node = require('../Node').Node;

exports.ArrayExpression = function (elements) {
  var self = this;
  Node.call(self);
  
  self.type = 'ArrayExpression';
  self.elements = elements;
  
  self.elements.forEach(function (element) {
    element.parent = self;
  });
};

exports.ArrayExpression.prototype = Object.create(Node);

exports.ArrayExpression.prototype.codegen = function () {
  var self = this;
  
  if (!Node.prototype.codegen.call(self)) {
    return;
  }
  
  self.elements.forEach(function (element, i) {
    self.elements[i] = element.codegen();
  });
  
  return self;
};

exports.ArrayExpression.prototype.hasCallExpression = function () {
  return true;
};