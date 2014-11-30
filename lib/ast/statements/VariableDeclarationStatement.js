$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function VariableDeclarationStatement(declarations) {
    Node.call(this);
    this.type = "VariableDeclaration";
    this.declarations = declarations;
    this.kind = "let";
    for (var $__0 = declarations[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var decl = $__1.value;
      {
        decl.parent = this;
      }
    }
  }
  VariableDeclarationStatement.prototype = Object.create(Node);
  VariableDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var i = 0;
    while (i < this.declarations.length) {
      var statement = this.declarations[i].codegen();
      if (typeof statement !== "undefined" && statement !== null) {
        this.declarations[this.declarations.indexOf(statement)] = statement;
      }
      i++;
    }
    return this;
  };
  exports.VariableDeclarationStatement = VariableDeclarationStatement;
  return {};
});

//# sourceMappingURL=VariableDeclarationStatement.map
