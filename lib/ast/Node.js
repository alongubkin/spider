exports.Node = function () {
  var self = this;
  self.codeGenerated = false;
  self.definedIdentifiers = [];
  
  Object.defineProperty(self, 'parent', {
    value: null,
    writable: true,
    configurable: true,
    enumerable: false
  });

  self.getContext = function () {
    if (self.type === 'Program' ||
        self.type === 'BlockStatement') {
      return { 
        node: self,
        position: -1
      };
    }
    
    if (self.parent === null) {
      return null;
    }
    
    var context = self.parent.getContext();
    
    if (!context) { 
      return null;
    }
    
    if (context.position === -1) {
      return {
        node: context.node,
        position: context.node.body.indexOf(self)
      };
    } else {
      return context;
    }
  };
  
  self.defineIdentifier = function (name) {
    self.definedIdentifiers.push(name);
  };
  
  self.isIdentifierDefined = function (name) {
    return self.definedIdentifiers.indexOf(name) !== -1 ||
      (self.parent && self.parent.isIdentifierDefined(name));
  };
};

exports.Node.prototype.codegen = function () {   
  if (this.codeGenerated) {
    return false;
  }
  
  this.codeGenerated = true;
  return true;
};

exports.Node.setErrorManager = function (errorManager) {
  this.errorManager = errorManager;
};

exports.Node.getErrorManager = function () {
  return this.errorManager;
};