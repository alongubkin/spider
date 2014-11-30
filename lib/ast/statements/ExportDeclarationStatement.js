$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function ExportDeclarationStatement(specifiers, source, declaration, isDefault) {
    Node.call(this);
    this.type = "ExportDeclaration";
    this["default"] = isDefault;
    this.specifiers = specifiers;
    if (typeof specifiers !== "undefined" && specifiers !== null) {
      for (var $__0 = this.specifiers[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var specifier = $__1.value;
        {
          specifier.parent = this;
        }
      }
    }
    this.source = source;
    if (typeof source !== "undefined" && source !== null) {
      this.source.parent = this;
    }
    this.declaration = declaration;
    if (typeof declaration !== "undefined" && declaration !== null) {
      this.declaration.parent = this;
    }
  }
  ExportDeclarationStatement.prototype = Object.create(Node);
  ExportDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    if (typeof this.specifiers !== "undefined" && this.specifiers !== null) {
      var i = 0;
      for (var $__0 = this.specifiers[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var specifier = $__1.value;
        {
          this.specifiers[i] = specifier.codegen();
          i++;
        }
      }
    }
    this.source = typeof this.source !== "undefined" && this.source !== null ? this.source.codegen() : void 0;
    this.declaration = typeof this.declaration !== "undefined" && this.declaration !== null ? this.declaration.codegen() : void 0;
    return this;
  };
  exports.ExportDeclarationStatement = ExportDeclarationStatement;
  return {};
});

//# sourceMappingURL=ExportDeclarationStatement.map
