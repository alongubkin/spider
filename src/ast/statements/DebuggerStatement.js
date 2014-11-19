var Node = require('../Node').Node;

exports.DebuggerStatement = function () {
  Node.call(this);
  
  this.type = 'DebuggerStatement';
};

exports.DebuggerStatement.prototype = Object.create(Node);

exports.DebuggerStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  return this;
};