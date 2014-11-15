var Node = require('../Node').Node,
    ForInStatement = require('../statements/ForInStatement').ForInStatement,
    BlockStatement = require('../statements/BlockStatement').BlockStatement;

exports.ForInExpression = function (expression, item, index, array, condition) {
  Node.call(this);
  
  this.type = 'ForInExpression';

  this.expression = expression;
  this.expression.parent = this;
  
  this.item = item;
  this.item.parent = this;
  
  this.index = index;
  if (this.index) {
    this.index.parent = this;
  }
  
  this.array = array;
  this.array.parent = this;
  
  this.condition = condition;
  if (this.condition) {
    this.condition.parent = this;
  }  
};

exports.ForInExpression.prototype = Object.create(Node);

exports.ForInExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.defineIdentifier(this.item);
  
  if (this.index) {
    this.defineIdentifier(this.index);
  }
  
  var id = {
    "type": "Identifier",
    "name": exports.ForInExpression.getNextVariableName(),
    "codeGenerated": true
  };
  
  var pushStatement = {
    "type": "ExpressionStatement",
    "codeGenerated": true,
    "expression": {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": id,
        "property": {
          "type": "Identifier",
          "name": "push"
        }
      },
      "arguments": [this.expression.codegen()]
    }
  };
  
  if (this.condition) {
    pushStatement = {
      "type": "IfStatement",
      "codeGenerated": true,
      "test": this.condition.codegen(),
      "consequent": {
        "type": "BlockStatement",
        "body": [pushStatement]
      },
      "alternate": null
    };
  }
  
  var forInStatement = new ForInStatement(this.item, this.index, this.array, 
    new BlockStatement([pushStatement]));
    
  forInStatement.parent = this;
  
  this.type = "CallExpression";
  this.callee = {
    "type": "FunctionExpression",
    "id": null,
    "params": [],
    "defaults": [],
    "body": {
      "type": "BlockStatement",
      "body": [
        {
          "type": "VariableDeclaration",
          "declarations": [
            {
              "type": "VariableDeclarator",
              "id": id,
              "init": {
                "type": "ArrayExpression",
                "elements": []
              }
            }
          ],
          "kind": "var",
          "codeGenerated": true
        },
        forInStatement.codegen(),
        {
          "type": "ReturnStatement",
          "argument": id
        }        
      ]
    }
  };
  
  Object.defineProperty(this, 'arguments', { 
    value: [], 
    enumerable: true 
  });
  
  return this;
};

exports.ForInExpression.prototype.hasCallExpression = function () {
  return true;
};

exports.ForInExpression.getNextVariableName = function () {
  if (!this.forInIndex) { 
    this.forInIndex = 0;
  }
  
  return "forIn" + this.forInIndex++;
};

exports.ForInExpression.resetVariableNames = function () {
  this.forInIndex = 0;
};