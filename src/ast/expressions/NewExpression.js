var Node = require('../Node').Node;

exports.NewExpression = function (callee, args) {
  var self = this;
  Node.call(self);
  
  self.type = 'NewExpression';
  
  self.callee = callee;
  self.callee.parent = self;
  
  Object.defineProperty(self, 'arguments', { 
    value: args, 
    enumerable: true 
  });
  
  args.forEach(function (arg) {
    arg.parent = self;
  });  
};

exports.NewExpression.prototype = Object.create(Node);

exports.NewExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.callee = this.callee.codegen();
  
  var args = this.arguments;
  args.forEach(function (arg, i) {
    args[i] = arg.codegen();
  });
  
  return this;
};

exports.NewExpression.prototype.hasCallExpression = function () {
  return true;
};