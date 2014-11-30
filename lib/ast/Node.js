$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  function Node() {
    var self = this;
    self.codeGenerated = false;
    self.definedIdentifiers = [];
    Object.defineProperty(self, "parent", {
      value: null,
      writable: true,
      configurable: true,
      enumerable: false
    });
    self.getContext = function() {
      if (!!(self.type === "Program") || !!(self.type === "BlockStatement")) {
        return {
          node: self,
          position: -1
        };
      }
      if (!(typeof self.parent !== "undefined" && self.parent !== null)) {
        return null;
      }
      var context = self.parent.getContext();
      if (!(typeof context !== "undefined" && context !== null)) {
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
    self.defineIdentifier = function(identifier) {
      self.definedIdentifiers.push(identifier);
    };
    self.isIdentifierDefined = function(name) {
      var defined = false;
      for (var $__0 = self.definedIdentifiers[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var identifier = $__1.value;
        {
          if (identifier.name === name) {
            defined = true;
          }
        }
      }
      return !!defined || !!(!!self.parent && !!self.parent.isIdentifierDefined(name));
    };
    self.getDefinedIdentifier = function(name) {
      var id;
      for (var $__0 = self.definedIdentifiers[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var identifier = $__1.value;
        {
          if (identifier.name === name) {
            id = identifier;
          }
        }
      }
      return typeof id === "undefined" || id == null ? self.parent ? self.parent.getDefinedIdentifier(name) : null : id;
    };
    self.blockWrap = function() {
      if (self.type === "BlockStatement") {
        return self;
      }
      var myParent = self.parent;
      var blockStatement = module.require("./statements/BlockStatement");
      var block = new blockStatement.BlockStatement([self]);
      block.parent = myParent;
      return block;
    };
  }
  Node.prototype.codegen = function() {
    if (this.codeGenerated) {
      return false;
    }
    this.codeGenerated = true;
    return true;
  };
  Node.setErrorManager = function(errorManager) {
    this.errorManager = errorManager;
  };
  Node.getErrorManager = function() {
    return this.errorManager;
  };
  exports.Node = Node;
  return {};
});

//# sourceMappingURL=Node.map
