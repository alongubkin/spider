var Node = require('./Node').Node;

exports.CatchClause = function (param, body) {
  Node.call(this);
  
  this.type = 'CatchClause';
  
  this.param = param;
  this.param.parent = this;
  
  this.body = body;
  this.body.parent = this;
};

exports.CatchClause.prototype = Object.create(Node);

exports.CatchClause.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.param = this.param.codegen(false);
  this.defineIdentifier(this.param);
  
  this.body = this.body.codegen();
  
  return this;
};