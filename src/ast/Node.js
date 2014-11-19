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
  
  self.defineIdentifier = function (identifier) {
    self.definedIdentifiers.push(identifier);
  };
  
  self.isIdentifierDefined = function (name) {
    var defined = false;
    self.definedIdentifiers.forEach(function (identifier) {
      if (identifier.name === name) {
        defined = true;
      }
    });
    
    return defined || (self.parent && self.parent.isIdentifierDefined(name));
  };
  
  self.getDefinedIdentifier = function (name) {
    var id;
    self.definedIdentifiers.forEach(function (identifier) {
      if (identifier.name === name) {
        id = identifier;
      }
    });
    
    return id || (self.parent && self.parent.getDefinedIdentifier(name));
  };
  
  self.blockWrap = function () {
    if (self.type === 'BlockStatement') {
      return self;
    }
    
    var myParent = self.parent;
    var blockStatement = require('./statements/BlockStatement');
    
    var block = new blockStatement.BlockStatement([self]);
    block.parent = myParent;
    
    return block;
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