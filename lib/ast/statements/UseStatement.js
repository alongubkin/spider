var Node = require('../Node').Node;

exports.UseStatement = function (id) {
  Node.call(this);
  
  this.type = 'UseStatement';
  
  this.id = id;
  this.id.parent = this;
};

exports.UseStatement.prototype = Object.create(Node);

exports.UseStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.getContext().node.defineIdentifier(this.id);
  return null;
};