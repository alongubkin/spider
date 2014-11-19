var Node = require('../Node').Node,
    Parameter = require('../Parameter').Parameter;
    
exports.FunctionExpression = function (id, params, body, inheritsFrom) {
  var self = this;
  Node.call(self);
  
  self.type = 'FunctionExpression'; 
  self.defaults = [];
  self.rest = null;
  self.generator = false;
  self.expression = false;  
  
  self.id = id;
  
  if (self.id) {
    self.id.parent = self;
  }
  
  self.body = body;
  self.params = params;
  
  body.parent = self;
  
  params.forEach(function (param) {
    param.parent = self;
  });
  
  self.inheritsFrom = inheritsFrom;
  
  if (self.inheritsFrom) {
    self.inheritsFrom.parent = self;
  }
  
  if (self.body.type !== 'BlockStatement') {
    self.autoBlock = true;
    self.body = {
      "type": "BlockStatement",
      "body": [
        {
          "type": "ReturnStatement",
          "argument": self.body
        }
      ]
    };
    
    self.getContext = function () {
      return { 
        node: self.body,
        position: -1
      };
    };
  }
};

exports.FunctionExpression.prototype = Object.create(Node);

exports.FunctionExpression.prototype.codegen = function () {
  var self = this;
  
  if (!Node.prototype.codegen.call(self)) {
    return;
  }
  
  if (self.id) {
    self.id = self.id.codegen(false);
  }
  
  Parameter.generateFunctionBody(self, self.params, self.body);
  
  if (self.autoBlock) {
    self.body.body[0].argument = self.body.body[self.body.body.length - 1].argument.codegen();
  } else {
    self.body = self.body.codegen();
  }
  
  if (self.inheritsFrom) {
    var context = self.getContext();
    
    self.body.body.splice(0, 0, {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": self.inheritsFrom.callee,
          "property": {
            "type": "Identifier",
            "name": "call"
          }
        },
        "arguments": [
          { "type": "ThisExpression" }
        ].concat(self.inheritsFrom.arguments)
      }
    });
    
    var id = {
      "type": "Identifier",
      "name": exports.FunctionExpression.getNextVariableName()
    };
    
    context.node.body.splice(context.position, 0, {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": id,
          "init": this
        }
      ],
      "kind": "var",
      "codeGenerated": true
    });

    context.node.body.splice(context.position + 1, 0, {
      "type": "ExpressionStatement",
      "codeGenerated": "true",
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": {
          "type": "MemberExpression",
          "computed": false,
          "object": id,
          "property": {
            "type": "Identifier",
            "name": "prototype"
          }
        },
        "right": {
          "type": "CallExpression",
          "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": {
              "type": "Identifier",
              "name": "Object"
            },
            "property": {
              "type": "Identifier",
              "name": "create"
            }
          },
          "arguments": [
            self.inheritsFrom.callee
          ]
        }
      }
    });
    
    return id;
  }

  return this;
};

exports.FunctionExpression.prototype.hasCallExpression = function () {
  return true;
};

exports.FunctionExpression.getNextVariableName = function () {
  if (!this.functionExpressionIndex) { 
    this.functionExpressionIndex = 0; 
  }

  return "functionExpression" + this.functionExpressionIndex++;
};

exports.FunctionExpression.resetVariableNames = function () {
  this.functionExpressionIndex = 0;
};