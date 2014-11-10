var Node = require('../Node').Node;

exports.Identifier = function (name) {
  Node.call(this);
  
  this.type = 'Identifier';
  this.global = false;
  
  Object.defineProperty(this, 'name', { 
    value: name, 
    enumerable: true 
  });  
};

exports.Identifier.prototype = Object.create(Node);

exports.Identifier.prototype.codegen = function (undefinedCheck) {
  if (!Node.prototype.codegen.call(this)) {
    return;
  }
  
  if (typeof undefinedCheck === 'undefined') {
    undefinedCheck = true;
  }
  
  // Compile-time undefined check
  if (undefinedCheck && !this.global) {
    // If this is not a new identifier, ...
    if (!(this.parent && (this.parent.type === "FunctionDeclaration" ||
                          this.parent.type === "VariableDeclarator") &&
          this.parent.id === this)) {
      // ... and this identifier is undefined, raise an error
      if (!this.parent.isIdentifierDefined(this.name)) {
        Node.getErrorManager().error({
          type: "UndefinedIdentifier",
          identifier: this.name,
          message: "undefined " + this.name,
          loc: this.loc
        });
      }
    } else {
      // If this is a new identifier, and this identifier 
      // is already defined, raise an error
      if (this.parent.isIdentifierDefined(this.name)) {
        Node.getErrorManager().error({
          type: "AlreadyDefinedIdentifier",
          identifier: this.name,
          message: this.name + " is already defined",
          loc: this.loc
        });
      } else {
        // otherwise, define this identifier
        this.parent.getContext().node.defineIdentifier(this);
      }
    }
  }
  
  return this;
};

exports.Identifier.prototype.hasCallExpression = function () {
  return false;
};

exports.Identifier.prototype.asGlobal = function () {
  this.global = true;
  return this;
};

exports.Identifier.prototype.asPredefinedCollection = function () {
  this.predefinedCollection = true;
  return this;
};