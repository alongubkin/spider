var Node = require('../Node').Node,
    Parameter = require('../Parameter').Parameter;

exports.FunctionDeclarationStatement = function (id, params, body, inheritsFrom) {
  var self = this;
  Node.call(self);
  
  self.type = 'FunctionDeclaration';
  self.defaults = [];
  self.rest = null;
  self.generator = false;
  self.expression = false;
  
  self.id = id;
  self.id.parent = self;
  
  self.body = body;
  self.body.parent = self;
  
  self.params = params;
  
  params.forEach(function (param) {
    param.parent = self;
  });
  
  self.inheritsFrom = inheritsFrom;
  
  if (self.inheritsFrom) {
    self.inheritsFrom.parent = self;
  }
};

exports.FunctionDeclarationStatement.prototype = Object.create(Node);

exports.FunctionDeclarationStatement.prototype.codegen = function () {
  var self = this;
  
  if (!Node.prototype.codegen.call(self)) {
    return;
  }
  
  self.id = self.id.codegen();
  Parameter.generateFunctionBody(self, self.params, self.body);
  
  self.body = self.body.codegen();
  
  if (self.inheritsFrom) {
    self.inheritsFrom = self.inheritsFrom.codegen();
    
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
    
    var context = self.getContext();
    context.node.body.splice(context.position + 1, 0, {
      "type": "ExpressionStatement",
      "codeGenerated": "true",
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": {
          "type": "MemberExpression",
          "computed": false,
          "object": self.id,
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
  }
  
  return this;
};

exports.FunctionDeclarationStatement.prototype.hasCallExpression = function () {
  return true;
};