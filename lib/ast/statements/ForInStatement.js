var Node = require('../Node').Node;

exports.ForInStatement = function (item, index, array, body) {
  Node.call(this);
  
  this.type = 'ForInStatement';
  
  this.item = item;
  this.item.parent = this;
  
  this.index = index;
  if (this.index) {
    this.index.parent = this;
  }
  
  this.array = array;
  this.array.parent = this;
  
  this.body = body;
  this.body.parent = this;
};

exports.ForInStatement.prototype = Object.create(Node);

exports.ForInStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.item = this.item.codegen(false);
  
  var params = [this.item];
  this.defineIdentifier(this.item);
  
  if (this.index) {
    this.index = this.index.codegen(false);
    params.push(this.index);
    
    this.defineIdentifier(this.index);
  }
  
  this.type = "ExpressionStatement";
  this.expression = {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "computed": false,
      "object": this.array.codegen(),
      "property": {
        "type": "Identifier",
        "name": "forEach"
      }
    },
    "arguments": [{
      "type": "FunctionExpression",
      "id": null,
      "params": params,
      "defaults": [],
      "body": this.body.blockWrap().codegen(),
      "rest": null,
      "generator": false,
      "expression": false
    }, { "type": "ThisExpression" }]
  };
  
  return this;
};