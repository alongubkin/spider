var Node = require('../Node').Node;

exports.ExistentialExpression = function (argument) {
  Node.call(this);
  
  this.type = 'ExistentialExpression';
  this.argument = argument;
  this.argument.parent = this;
};

exports.ExistentialExpression.prototype = Object.create(Node);

exports.ExistentialExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var isArgumentCallExpression = this.argument.hasCallExpression && this.argument.hasCallExpression();
  
  this.argument = this.argument.codegen();
  
  // If the argument has a function call (e.g: a().b)
  // then store its value in a separate variable to avoid
  // calling the function twice.
  if (isArgumentCallExpression) {
    var context = this.getContext();
    
    var id = {
      "type": "Identifier",
      "name": exports.ExistentialExpression.getNextVariableName()    
    };
    
    context.node.body.splice(context.position + 
      (exports.ExistentialExpression.existentialIndex - 2), 0, {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": id,
          "init": this.argument
        }
      ],
      "kind": "var",
      "codeGenerated": true
    });
    
    this.argument = id;
  }
  
  // The generated syntax looks like:
  // argument === null
  var nullCheck = {
    "type": "BinaryExpression",
    "operator": "!==",
    "left": this.argument,
    "right": {
      "type": "Literal",
      "value": null,
      "raw": "null"
    }
  };
  
  // Add undefined check
  this.type = 'LogicalExpression';
  this.operator = '&&';
  this.left = {
    "type": "BinaryExpression",
    "operator": "!==",
    "left": {
      "type": "UnaryExpression",
      "operator": "typeof",
      "argument": this.argument,
      "prefix": true
    },
    "right": {
      "type": "Literal",
      "value": "undefined",
      "raw": "'undefined'"
    }
  };
  
  this.right = nullCheck;
  return this;
};

exports.ExistentialExpression.prototype.hasCallExpression = function () {
  return (this.argument !== null && 
          this.argument.hasCallExpression && 
          this.argument.hasCallExpression());
};

exports.ExistentialExpression.getNextVariableName = function () {
  if (!this.existentialIndex) { 
    this.existentialIndex = 0;
  }
  
  return "existential" + this.existentialIndex++;
};

exports.ExistentialExpression.resetVariableNames = function () {
  this.existentialIndex = 0;
};