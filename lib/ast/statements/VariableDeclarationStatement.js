var Node = require('../Node').Node;

exports.VariableDeclarationStatement = function (declarations) {
  var self = this;
  Node.call(self);
  
  self.type = 'VariableDeclaration';
  self.declarations = declarations;
  self.kind = 'var';
  
  declarations.forEach(function (decl) {
    decl.parent = self;
  });
};

exports.VariableDeclarationStatement.prototype = Object.create(Node);

exports.VariableDeclarationStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var i = 0;
  while (i < this.declarations.length) {
    var statement = this.declarations[i].codegen();
    if (statement) {
      this.declarations[this.declarations.indexOf(statement)] = statement;
    }
    i++;
  }
  
  return this;
};