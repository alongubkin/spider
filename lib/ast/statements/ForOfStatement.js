var Node = require('../Node').Node;

exports.ForOfStatement = function (key, value, object, body) {
  Node.call(this);
  
  this.type = 'ForOfStatement';
  
  this.key = key;
  this.key.parent = this;
  
  this.value = value;
  if (this.value) {
    this.value.parent = this;
  }
  
  this.object = object;
  this.object.parent = this;
  
  this.body = body;
  this.body.parent = this;
};

exports.ForOfStatement.prototype = Object.create(Node);

exports.ForOfStatement.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.key = this.key.codegen(false);
  this.defineIdentifier(this.key);
  
  this.object = this.object.codegen();
  
  if (this.value) {
    this.value = this.value.codegen(false);
    this.defineIdentifier(this.value);
    
    this.body = this.body.blockWrap().codegen();
    
    if (this.object.hasCallExpression()) {
      var id = {
        "type": "Identifier",
        "name": exports.ForOfStatement.getNextVariableName()
      };
      
      var context = this.getContext();
      context.node.body.splice(context.position, 0, {
        "type": "VariableDeclaration",
        "declarations": [{
          "type": "VariableDeclarator",
          "id": id,
          "init": this.object
        }],
        "kind": "var",
        "codeGenerated": true
      });
      
      this.object = id;
    }
    
    this.body.body = [{
      "type": "VariableDeclaration",
      "declarations": [{
        "type": "VariableDeclarator",
        "id": this.value,
        "init": {
          "type": "MemberExpression",
          "computed": "true",
          "object": this.object,
          "property": this.key
        }
      }],
      "kind": "var",
    }].concat(this.body.body);
  } else {
    this.body = this.body.blockWrap().codegen();
  }
  
  this.type = "ExpressionStatement";
  this.expression = {
    "type": "CallExpression",
    "callee": {
      "type": "MemberExpression",
      "computed": false,
      "object": {
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
            "name": "keys"
          }
        },
        "arguments": [this.object]
      },
      "property": {
        "type": "Identifier",
        "name": "forEach"
      }
    },
    "arguments": [{
      "type": "FunctionExpression",
      "id": null,
      "params": [this.key],
      "defaults": [],
      "body": this.body,
      "rest": null,
      "generator": false,
      "expression": false
    }, { "type": "ThisExpression" }]
  };
  
  return this;
};

exports.ForOfStatement.getNextVariableName = function () {
  if (!this.forOfIndex) { 
    this.forOfIndex = 0; 
  }

  return "forOf" + this.forOfIndex++;
};

exports.ForOfStatement.resetVariableNames = function () {
  this.forOfIndex = 0;
};