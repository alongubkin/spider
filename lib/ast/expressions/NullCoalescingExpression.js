var Node = require('../Node').Node;

exports.NullCoalescingExpression = function (left, right) {
  Node.call(this);
  
  this.type = 'NullCoalescingExpression';
  
  this.left = left;
  this.left.parent = this;
  
  this.right = right;
  this.right.parent = this;
};

exports.NullCoalescingExpression.prototype = Object.create(Node);

exports.NullCoalescingExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var leftType = this.left.type;
  
  this.left = this.left.codegen();
  this.right = this.right.codegen();
  
  var context = this.getContext();
  var addUndefinedCheck = true;
  
  // If the left expression is a function call (e.g: f() ?? 5)
  // then store its value in a separate variable to avoid
  // calling the function twice.
  if (leftType === 'NullPropagatingExpression' ||
      leftType === 'NullCoalescingExpression' ||
      (this.left.hasCallExpression && this.left.hasCallExpression())) {
         
    var id = {
      "type": "Identifier",
      "name": exports.NullCoalescingExpression.getNextLeftName()
    };
    
    context.node.body.splice(context.position, 0, {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": id,
          "init": this.left
        }
      ],
      "kind": "var",
      "codeGenerated": true
    });
    
    this.left = id;
    addUndefinedCheck = false;
  }
   
  var test = {
    "type": "BinaryExpression",
    "operator": "===",
    "left": this.left,
    "right": {
      "type": "Literal",
      "value": null,
      "raw": "null"
    }
  };

  if (this.left.type !== 'Identifier') {
    addUndefinedCheck = false;
  }

  if (addUndefinedCheck) {
    test = {
      "type": "LogicalExpression",
      "operator": "||",
      "left": {
        "type": "BinaryExpression",
        "operator": "===",
        "left": {
          "type": "UnaryExpression",
          "operator": "typeof",
          "argument": this.left,
          "prefix": true
        },
        "right": {
          "type": "Literal",
          "value": "undefined",
          "raw": "'undefined'"
        }
      },
      "right": test
    };
  }

  // If the null coalescing operator is an expression
  // statement child, the generated JS should be an if statement.
  if (this.parent !== null && 
      this.parent.type === 'ExpressionStatement') {
    
    if (!this.right.hasCallExpression()) {
      this.parent.type = 'EmptyStatement';
      return this;
    }
    
    this.parent.type = 'IfStatement';
    this.parent.test = test;
        
    this.parent.consequent = {
      "type": "BlockStatement",
      "body": [
        {
          "type": "ExpressionStatement",
          "expression": this.right
        }
      ]
    };
  } else {
    // Otherwise - if the null coalescing operator is 
    // inside an expression, the generated JS should 
    // look like:
    // 
    // typeof left === 'undefined' || left === null ? right : left
    
    return {
      "type": "ConditionalExpression",
      "test": test,
      "consequent": this.right,
      "alternate": this.left
    };
  }
};

exports.NullCoalescingExpression.prototype.hasCallExpression = function () {
  return (this.left !== null && this.left.hasCallExpression()) ||
         (this.right !== null && this.right.hasCallExpression());
};

exports.NullCoalescingExpression.getNextLeftName = function () {
  if (!this.nullCoalescingIndex) { 
    this.nullCoalescingIndex = 0; 
  }

  return "nullCoalescing" + this.nullCoalescingIndex++;
};

exports.NullCoalescingExpression.resetVariableNames = function () {
  this.nullCoalescingIndex = 0;
};