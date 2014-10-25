var Node = require('../Node').Node;
    
exports.FunctionExpression = function (params, body) {
  var self = this;
  Node.call(self);
  
  self.type = 'FunctionExpression'; 
  self.defaults = [];
  self.rest = null;
  self.generator = false;
  self.expression = false;  
  self.id = null;
  
  self.body = body;
  self.params = params;
  
  body.parent = self;
  
  params.forEach(function (param) {
    param.parent = self;
  });
};

exports.FunctionExpression.prototype = Object.create(Node);

exports.FunctionExpression.prototype.codegen = function () {
  var self = this;
  
  if (!Node.prototype.codegen.call(self)) {
    return;
  }
  
  self.body = self.body.codegen();
  self.params.forEach(function (param, i) {
    self.params[i] = param.codegen();
  });
  
  return this;
};

exports.FunctionExpression.prototype.hasCallExpression = function () {
  return true;
};