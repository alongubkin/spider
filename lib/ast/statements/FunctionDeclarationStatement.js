var Node = require('../Node').Node;

exports.FunctionDeclarationStatement = function (id, params, body) {
  var self = this;
  Node.call(self);
  
  self.type = 'FunctionDeclaration';
  self.defaults = [];
  self.rest = null;
  self.generator = false;
  self.expression = false;
  
  self.id = id;
  self.body = body;
  self.params = params;
  
  body.parent = self;
  
  params.forEach(function (param) {
    param.parent = self;
  });
};

exports.FunctionDeclarationStatement.prototype = Object.create(Node);

exports.FunctionDeclarationStatement.prototype.codegen = function () {
  var self = this;
  
  if (!Node.prototype.codegen.call(self)) {
    return;
  }
  
  self.id = self.id.codegen();
  self.body = self.body.codegen();
  self.params.forEach(function (param, i) {
    self.params[i] = param.codegen();
  });
  
  return this;
};

exports.FunctionDeclarationStatement.prototype.hasCallExpression = function () {
  return true;
};