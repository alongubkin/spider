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
  
  // Find a parent function that extends another function
  // (has the extends keyword) or a prototype assignment
  var parentNode = this;
  var node = this;
  while (node && !node.inheritsFrom &&
    (node.type !== 'AssignmentExpression' || ((!node.left.property || node.left.property.name !== 'prototype') && 
      (!node.left.object.property || node.left.object.property.name !== 'prototype')))) {
    parentNode = node;
    node = node.parent;
  }
  
  // Raise an error if there's no parent function
  if (!node) {   
    Node.getErrorManager().error({
      type: "InvalidContextForSuper",
      message: "invalid context for super keyword",
      loc: this.loc
    });
    
    return { type: 'ThisExpression' };
  }
  
  // Add _self variable to a context.
  var addSelf = function (context) {
    var selfId = {
      "type": "Identifier",
      "name": "_self",
      "codeGenerated": "true"
    };
    
    if (!context.node.__isSelfDefined) {
      context.node.body.splice(0, 0, {
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
      
      context.node.__isSelfDefined = true;
    }
    
    return selfId;
  };
  
  // Modify the call expression to look like:
  // _fn.call(_self)
  var mutateCallExpression = function (id, parent, selfNode) {
    selfNode.codeGenerated = true;
    
    parent.object = id;
    parent.property = Object.create({
      "codeGenerated": "true",
      "type": "Identifier",
      "name": "call"
    });
    parent.parent.arguments.splice(0, 0, selfNode);
  };
  
  // If we are inside a prototype function, change 
  // something like: super.x() to Base.prototype.x.call(_self);
  if (node.type === 'AssignmentExpression') {
    var identifier = node.left.object;
    var context;
    
    if (node.left.property.name !== 'prototype') {
      identifier = identifier.object;
      context = { node: node.right.body };
    } else {
      // Make sure that the syntax is something like:
      // Fn.prototype = { ... }
      if (node.right.type !== 'ObjectExpression') {
        Node.getErrorManager().error({
          type: "InvalidUsageForSuper",
          message: "invalid usage of super keyword",
          loc: this.loc
        });
        
        return { type: 'ThisExpression' };
      }
      
      var contextNode = this;
      while (contextNode.parent && contextNode.parent !== node.right) {
        contextNode = contextNode.parent;
      }

      // Make sure that the syntax is something like:
      // Fn.prototype = { test: func () { ... } }
      if (!contextNode || contextNode.type !== 'Property' || 
          !contextNode.value || contextNode.value.type !== 'FunctionExpression') {
        Node.getErrorManager().error({
          type: "InvalidUsageForSuper",
          message: "invalid usage of super keyword",
          loc: this.loc
        });
        
        return { type: 'ThisExpression' };
      }
      
      context = { node: contextNode.value.body };
    }
    
    var selfNode;
    if (context.node === this.getContext().node) {
      selfNode = { type: 'ThisExpression' };
    } else {
      selfNode = addSelf(context);
    }
    
    // If this is a call expression, e.g: super.test(), 
    // Turn this into Base.prototype.test.call(_self)
    if (this.parent.parent.type === 'CallExpression') {
      var memberExpression = {
        type: 'MemberExpression',
        computed: false,
        object: {
        type: 'MemberExpression',
          computed: false,
          object: this.parent.getDefinedIdentifier(identifier.name).parent.inheritsFrom.callee,
          property: {
            type: 'Identifier',
            name: 'prototype'
          }
        },
        property: this.parent.parent.callee.property
      };
      
      mutateCallExpression(memberExpression, this.parent, selfNode);
      return memberExpression;
    }
    
    // Otherwise, just return (this|_self).property
    return selfNode;
  }
  
  var superContext = parentNode.getContext(); 
  
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
  
  var id = {
    "type": "Identifier",
    "name": "_" + this.parent.property.name
  };
  
  // Declare a new variable in the function that extends
  // with a reference to our property
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
    mutateCallExpression(id, this.parent, addSelf(superContext));
  } else {
    // Otherwise, just refer to the variable
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