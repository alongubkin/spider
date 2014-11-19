var Node = require('../Node').Node;

exports.InExpression = function (left, right) {
  Node.call(this);
  
  this.type = 'InExpression';
  
  this.left = left;
  this.left.parent = this;
  
  this.right = right;
  this.right.parent = this;
};

exports.InExpression.prototype = Object.create(Node);

exports.InExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.left = this.left.codegen();
  this.right = this.right.codegen();
  
  if (this.right.hasCallExpression && this.right.hasCallExpression()) {
    var context = this.getContext();
    
    var id = {
      "type": "Identifier",
      "name": exports.InExpression.getNextVariableName(),
      "codeGenerated": true
    };
    
    context.node.body.splice(context.position + 
      (exports.InExpression.inExpressionIndex - 2), 0, {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": id,
          "init": this.right
        }
      ],
      "kind": "var",
      "codeGenerated": true
    });
    
    this.right = id;
  }
  
  this.type = "ConditionalExpression";
  this.test = {
    "type": "BinaryExpression",
    "operator": "instanceof",
    "left": this.right,
    "right": {
      "type": "Identifier",
      "name": "Array"
    }
  };
  
  this.consequent = {
    "type": "BinaryExpression",
    "operator": "!==",
    "left": {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": this.right,
        "property": {
          "type": "Identifier",
          "name": "indexOf"
        }
      },
      "arguments": [this.left]
    },
    "right": {
      "type": "UnaryExpression",
      "operator": "-",
      "argument": {
        "type": "Literal",
        "value": 1,
        "raw": "1"
      },
      "prefix": true
    }
  };
  
  this.alternate = {
    "type": "BinaryExpression",
    "operator": "in",
    "left": this.left,
    "right": this.right
  };
    
  return this;
};

exports.InExpression.prototype.hasCallExpression = function () {
  return true;
};

exports.InExpression.getNextVariableName = function () {
  if (!this.inExpressionIndex) { 
    this.inExpressionIndex = 0;
  }
  
  return "inExpression" + this.inExpressionIndex++;
};

exports.InExpression.resetVariableNames = function () {
  this.inExpressionIndex = 0;
};