var Node = require('../Node').Node;

exports.UseStatement = function (identifiers) {
  var self = this;
  Node.call(self);
  
  self.type = 'UseStatement';
  
  self.identifiers = identifiers;
  self.identifiers.forEach(function (id) {
    id.parent = self;
  });
};

exports.UseStatement.prototype = Object.create(Node);

exports.UseStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var context = this.getContext().node;
  this.identifiers.forEach(function (id) {
    context.defineIdentifier(id);
  });
  
  return null;
};