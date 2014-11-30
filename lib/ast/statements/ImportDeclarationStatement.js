$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function ImportDeclarationStatement(specifiers, source, kind) {
    Node.call(this);
    this.type = "ImportDeclaration";
    this.kind = kind;
    this.specifiers = specifiers;
    for (var $__0 = this.specifiers[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var specifier = $__1.value;
      {
        specifier.parent = this;
      }
    }
    this.source = source;
    this.source.parent = this;
  }
  ImportDeclarationStatement.prototype = Object.create(Node);
  ImportDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var i = 0;
    for (var $__0 = this.specifiers[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var specifier = $__1.value;
      {
        this.specifiers[i] = specifier.codegen();
        i++;
      }
    }
    this.source = this.source.codegen();
    return this;
  };
  exports.ImportDeclarationStatement = ImportDeclarationStatement;
  return {};
});

//# sourceMappingURL=ImportDeclarationStatement.map
