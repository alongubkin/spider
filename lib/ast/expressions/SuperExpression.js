var Node = require('../Node').Node;
var extend = require('util')._extend;

exports.SuperExpression = function () {
  Node.call(this);
  this.type = 'SuperExpression';
};

exports.SuperExpression.prototype = Object.create(Node);

exports.SuperExpression.prototype.codegen = function () {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  // Raise an error if we are getting a syntax  
  // such as: super?.test
  if (this.parent.type === 'NullPropagatingExpression') {
    Node.getErrorManager().error({
      type: "InvalidSuperReference",
      message: "cannot refer to super before the ?. operator",
      loc: this.loc
    });
    
    return { type: 'ThisExpression' };
  }
  
  // Find a parent function that extends another function
  // (has the extends keyword) or a prototype assignment
  var parentNode = this;
  var node = this;
  while (node && !node.inheritsFrom &&
    (node.type !== 'AssignmentExpression' || (node.right.name !== 'prototype' && 
      (!node.left.object.property || node.left.object.property.name !== 'prototype')))) {
    parentNode = node;
    node = node.parent;
  }
  
  if (!node) {   
    Node.getErrorManager().error({
      type: "InvalidContextForSuper",
      message: "invalid context for super keyword",
      loc: this.loc
    });
    
    return { type: 'ThisExpression' };
  }
  
  if (node.type === 'AssignmentExpression') {
    var identifier = node.left;
    if (node.right.name !== 'prototype') {
      identifier = identifier.object.object;
    }
    
    return {
      type: 'MemberExpression',
      computed: false,
      object: this.parent.getDefinedIdentifier(identifier.name).parent.inheritsFrom.callee,
      property: {
        type: 'Identifier',
        name: 'prototype'
      }
    };
  }
  
  var superContext = parentNode.getContext(); 
  
  // The only supported use case for super is 
  // member expression (e.g: super.x)
  if (this.parent.type !== 'MemberExpression') {
    Node.getErrorManager().error({
      type: "InvalidUsageForSuper",
      message: "invalid usage of super keyword",
      loc: this.loc
    });
    
    return { type: 'ThisExpression' };
  }
  
  // Find the most left side in the member expression
  // For super.a.b.c.d, the most left side would be super
  var lastObject = this.parent;
  while (lastObject.object.type === 'MemberExpression') {
    lastObject = lastObject.object;
  }
  
  // Change it to a this expression
  lastObject.object = {
    type: 'ThisExpression'
  };
  
  // Declare a new variable in the function that extends
  // with a reference to our property
  var id = {
    "type": "Identifier",
    "name": "_" + this.parent.property.name
  };
  
  if (!this.parent.isIdentifierDefined(id.name)) {
    superContext.node.body.splice(superContext.position, 0, {
      "codeGenerated": "true",
      "type": "VariableDeclaration",
      "declarations": [{
        "type": "VariableDeclarator",
        "id": id,
        "init": extend({}, lastObject)
      }],
      "kind": "var"
    });
    
    superContext.node.defineIdentifier(id);
  }
  
  // If we are in a call expression, change it to:
  // _fn.call(_self)
  if (this.parent.parent.type === 'CallExpression') {
    var selfId = {
      "type": "Identifier",
      "name": "_self",
      "codeGenerated": "true"
    };
    
    if (!superContext.__isSelfDefined) {
      superContext.node.body.splice(0, 0, {
        "type": "VariableDeclaration",
        "declarations": [{
          "type": "VariableDeclarator",
          "id": selfId,
          "init": {
            type: "ThisExpression"
          }
        }],
        "kind": "var"
      });
      
      superContext.__isSelfDefined = true;
    }    
    
    this.parent.object = id;
    this.parent.property = Object.create({
      "codeGenerated": "true",
      "type": "Identifier",
      "name": "call"
    });
    this.parent.parent.arguments.splice(0, 0, selfId);
  } else {
    // Otherwise, just reference to the variable
    this.parent.type = 'Identifier';
    Object.defineProperty(this.parent, 'name', { 
      value: id.name, 
      enumerable: true 
    });  
  }
  
  return id;
};

exports.SuperExpression.prototype.hasCallExpression = function () {
  return false;
};