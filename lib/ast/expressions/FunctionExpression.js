var Node = require('../Node').Node;
    
exports.FunctionExpression = function (id, params, body) {
  var self = this;
  Node.call(self);
  
  self.type = 'FunctionExpression'; 
  self.defaults = [];
  self.rest = null;
  self.generator = false;
  self.expression = false;  
  
  self.id = id;
  
  if (self.id) {
    self.id.parent = self;
  }
  
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
  
  if (self.id) {
    self.id = self.id.codegen(false);
  }
  
  self.params.forEach(function (param, i) {
    self.params[i] = param.codegen(false);
    self.defineIdentifier(param.name);
  });
  
  self.body = self.body.codegen();
  
  if (self.body.type !== 'BlockStatement') {
    self.body = {
      "type": "BlockStatement",
      "body": [
        {
          "type": "ReturnStatement",
          "argument": self.body
        }
      ]
    };
  }

  
  return this;
};

exports.FunctionExpression.prototype.hasCallExpression = function () {
  return true;
};