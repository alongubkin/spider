var Node = require('./Node').Node;

exports.Parameter = function (id, defaultValue) {
  Node.call(this);
  
  this.type = 'Parameter';
  
  this.id = id;
  this.id.parent = this;
  
  this.defaultValue = defaultValue;
  
  if (this.defaultValue) {
    this.defaultValue.parent = this;
  }
};

exports.Parameter.prototype = Object.create(Node);

exports.Parameter.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  this.id = this.id.codegen(false);
  
  if (this.defaultValue) {
    this.defaultValue = this.defaultValue.codegen();
    
    return {
      "type": "IfStatement",
      "test": {
        "type": "BinaryExpression",
        "operator": "==",
        "left": this.id,
        "right": {
          "type": "Literal",
          "value": null,
          "raw": "null"
        }
      },
      "consequent": {
        "type": "BlockStatement",
        "body": [{
          "type": "ExpressionStatement",
          "expression": {
            "type": "AssignmentExpression",
            "operator": "=",
            "left": this.id,
            "right": this.defaultValue
          }
        }]
      },
      "alternate": null
    };
  }
  
  return null;
};

exports.Parameter.prototype.hasCallExpression = function () {
  return false;
};