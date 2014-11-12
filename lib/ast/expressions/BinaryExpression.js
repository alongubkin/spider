var Node = require('../Node').Node;

exports.BinaryExpression = function (left, operator, right) {
  Node.call(this);
  
  this.type = 'BinaryExpression';
  this.operator = operator;
  

  
  this.left = left;
  this.left.parent = this;
  
  this.right = right;
  this.right.parent = this;
};

exports.BinaryExpression.prototype = Object.create(Node);

exports.BinaryExpression.prototype.codegen = function () {
  var self = this;
  
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.left = this.left.codegen();
  this.right = this.right.codegen();
  
  switch (this.operator) {
  case '==':
    this.operator = '===';
    break;
    
  case '!=':
    this.operator = '!==';
    break;
    
  case '**':
    this.type = 'CallExpression';
    this.callee = {
      "type": "MemberExpression",
      "computed": false,
      "object": {
        "type": "Identifier",
        "name": "Math"
      },
      "property": {
        "type": "Identifier",
        "name": "pow"
      }
    };
    
    Object.defineProperty(self, 'arguments', { 
      value: [this.left, this.right], 
      enumerable: true 
    });
    
    break;
    
  case '#':
    this.type = 'CallExpression';
    this.callee = {
      "type": "MemberExpression",
      "computed": false,
      "object": {
        "type": "Identifier",
        "name": "Math"
      },
      "property": {
        "type": "Identifier",
        "name": "floor"
      }
    };
    
    Object.defineProperty(self, 'arguments', { 
      value: [{
        "type": "BinaryExpression",
        "operator": "/",
        "left": this.left,
        "right": this.right
      }], 
      enumerable: true 
    });
    
    break;
  
  case '%%':
    this.operator = '%';
    this.left = {
      "type": "BinaryExpression",
      "operator": "+",
      "left": {
        "type": "BinaryExpression",
        "operator": "%",
        "left": this.left,
        "right": this.right
      },
      "right": this.right
    };    
  }
  
  return this;
};

exports.BinaryExpression.prototype.hasCallExpression = function () {
  return (this.left !== null && this.left.hasCallExpression()) ||
         (this.right !== null && this.right.hasCallExpression());
};