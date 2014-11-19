var Node = require('../Node').Node,
    CallExpression = require('./CallExpression').CallExpression;
    
exports.NullCheckCallExpression = function (callee, args) {
  var self = this;
  Node.call(self);
  
  self.type = 'NullCheckCallExpression';
  
  self.callee = callee;
  self.callee.parent = this;
  
  self.args = args;
  
  args.forEach(function (arg) {
    arg.parent = self;
  });  
};

exports.NullCheckCallExpression.prototype = Object.create(Node);

exports.NullCheckCallExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var calleeType = this.callee.type;
  
  this.callee = this.callee.codegen();
  
  var args = this.args;
  args.forEach(function (arg, i) {
    var isSplat = args[i].type === "SplatExpression";    
    args[i] = arg.codegen();
    args[i].codeGenerated = true;
    
    if (isSplat) {
      args[i].__splat = true;
    }
  });
  
  // If the callee has a function call (e.g: a().b)
  // then store its value in a separate variable to avoid
  // calling the function twice.
  if (this.callee.hasCallExpression && this.callee.hasCallExpression()) {
    var context = this.getContext();
    
    var id = {
      "type": "Identifier",
      "name": exports.NullCheckCallExpression.getNextVariableName(),
      "codeGenerated": true
    };
    
    context.node.body.splice(context.position + 
      (exports.NullCheckCallExpression.nullCheckIndex - 2), 0, {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": id,
          "init": this.callee
        }
      ],
      "kind": "var",
      "codeGenerated": true
    });
    
    this.callee = id;
  }
  
  // Create a basic typeof callee !== "function" check
  var test = {
    "type": "BinaryExpression",
    "operator": "===",
    "left": {
      "type": "UnaryExpression",
      "operator": "typeof",
      "argument": this.callee,
      "prefix": true
    },
    "right": {
      "type": "Literal",
      "value": "function",
      "raw": "\"function\""
    }
  };
  
  var argument = test.left.argument;
  
  // If we are null propagating (?.), then make sure to
  // add the null propagating condition 
  if (calleeType === 'NullPropagatingExpression') {
    argument = argument.consequent;
    test.left.argument = argument;
    
    test = {
      "type": "LogicalExpression",
      "operator": "&&",
      "left": this.callee.test,
      "right": test
    };
  } 
  
  argument.codeGenerated = true;
  var consequent = new CallExpression(argument, args).codegen();
    
  if (this.parent.type === 'ExpressionStatement') {
    this.parent.type = 'IfStatement';
    this.parent.test = test;
    this.parent.consequent = {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression: consequent
        }
      ]
    };
    this.parent.alternate = null;
  } else {
    this.type = 'ConditionalExpression';
    this.test = test;
    this.consequent = consequent;
    this.alternate = {
      "type": "UnaryExpression",
      "operator": "void",
      "argument": {
        "type": "Literal",
        "value": 0,
        "raw": "0"
      },
      "prefix": true
    };
  }
  return this;
};

exports.NullCheckCallExpression.prototype.hasCallExpression = function () {  
  return true;
};

exports.NullCheckCallExpression.getNextVariableName = function () {
  if (!this.nullCheckIndex) { 
    this.nullCheckIndex = 0;
  }
  
  return "nullCheck" + this.nullCheckIndex++;
};

exports.NullCheckCallExpression.resetVariableNames = function () {
  this.nullCheckIndex = 0;
};