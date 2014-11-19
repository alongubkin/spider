var Node = require('../Node').Node;

exports.NullPropagatingExpression = function (left, right) {
  Node.call(this);
  
  this.type = 'NullPropagatingExpression';
  this.computed = false;
  this.object = left;
  this.property = right;
  
  left.parent = this;
  right.parent = this;
};

exports.NullPropagatingExpression.prototype = Object.create(Node);

exports.NullPropagatingExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  var context = this.getContext();
  var childType = this.object.type;
  
  this.object = this.object.codegen();
  this.property = this.property.codegen(false);
  
  // If the left expression is a function call (e.g: a()?.b)
  // then store its value in a separate variable to avoid
  // calling the function twice.
  if (this.object.hasCallExpression && this.object.hasCallExpression()) {
    var id = {
      "type": "Identifier",
      "name": exports.NullPropagatingExpression.getNextObjectName(),
      "__member_expression": {
        "type": "MemberExpression",
        "object": this.object,
        "property": this.property,
        "computed": false
      },      
    };
    
    context.node.body.splice(context.position + 
      (exports.NullPropagatingExpression.nullPropagatingIndex - 1), 0, {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": id,
          "init": this.object
        }
      ],
      "kind": "var",
      "codeGenerated": true
    });
    
    this.object = id;
  }
  
  var condition;
  
  // If this node is the last NullPropagatingExpression in
  // the tree, then just create a simple object !== null condition
  if (childType !== 'NullPropagatingExpression') {
    condition = {
      "type": "BinaryExpression",
      "operator": "!==",
      "left": this.object,
      "right": {
        "type": "Literal",
        "value": null,
        "raw": "null"
      },
      "__member_expression": {
        "type": "MemberExpression",
        "object": this.object,
        "property": this.property,
        "computed": false
      },
      "__first_object": this.object
    };
  } else {
    // Otherwise create an object !== null condition and add it
    // with logical AND to the previous condition
    condition = {
      "type": 'LogicalExpression',
      "operator": '&&',
      "left": this.object,
      "right": {
        "type": "BinaryExpression",
        "operator": "!==",
        "left": {
          "type": "MemberExpression",
          "object": this.object.__member_expression.object,
          "property": this.object.__member_expression.property,
          "computed": false
        },
        "right": {
          "type": "Literal",
          "value": null,
          "raw": "null"
        },
      },
      "__member_expression": {
        "type": "MemberExpression",
        "object": this.object.__member_expression,
        "property": this.property,
        "computed": false
      },
      "__first_object": this.object.__first_object
    };
  }
  
  // Return the condition if this isn't the first NullPropagatingExpression
  if (this.parent && this.parent.type === 'NullPropagatingExpression') {
    return condition;
  }
    
  // Add typeof object !== undefined check
  condition = {
    "type": 'LogicalExpression',
    "operator": '&&',
    "left": {
      "type": "BinaryExpression",
      "operator": "!==",
      "left": {
        "type": "UnaryExpression",
        "operator": "typeof",
        "argument": this.object.__first_object ? 
          this.object.__first_object : 
          this.object
      },
      "right": {
        "type": "Literal",
        "value": "undefined",
        "raw": "\"undefined\""
      },
    },
    "right": condition
  };

  condition = {
    "type": "ConditionalExpression",
    "test": condition,
    "consequent": {
      "type": "MemberExpression",
      "object": this.object.type === 'Identifier' || !this.object.__member_expression ? this.object : this.object.__member_expression ,
      "property": this.property,
      "computed": false
    },
    "alternate": {
      "type": "UnaryExpression",
      "operator": "void",
      "argument": {
        "type": "Literal",
        "value": 0,
        "raw": "0"
      },
      "prefix": true
    },
    "__null_propagating": true
  };  

  return condition;
};

exports.NullPropagatingExpression.prototype.hasCallExpression = function () {
  return true;
};

exports.NullPropagatingExpression.getNextObjectName = function () {
  if (!this.nullPropagatingIndex) { 
    this.nullPropagatingIndex = 0;
    this.definedObjectNames = [];
  }

  var name = "nullPropagating" + this.nullPropagatingIndex++;
  this.definedObjectNames.push(name);
  
  return name;
};

exports.NullPropagatingExpression.isObjectNameDefined = function (name) {
  return this.definedObjectNames.indexOf(name) !== -1;
};

exports.NullPropagatingExpression.resetVariableNames = function () {
  this.nullPropagatingIndex = 0;
  this.definedObjectNames = [];
};
