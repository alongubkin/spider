var Node = require('../Node').Node;

exports.ObjectExpression = function (properties) {
  var self = this;
  Node.call(self);
  
  self.type = 'ObjectExpression';
  self.properties = properties;
  
  self.properties.forEach(function (property) {
    property.parent = self;
  });
};

exports.ObjectExpression.prototype = Object.create(Node);

exports.ObjectExpression.prototype.codegen = function () {
  var self = this;
  
  if (!Node.prototype.codegen.call(self)) {
    return;
  }
  
  self.properties.forEach(function (property, i) {
    self.properties[i] = property.codegen();
  });
  
  return self;
};

exports.ObjectExpression.prototype.hasCallExpression = function () {
  return true;
};