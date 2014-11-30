$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function ReturnStatement(argument) {
    Node.call(this);
    this.type = "ReturnStatement";
    this.argument = argument;
    if (typeof this.argument !== "undefined" && this.argument !== null) {
      this.argument.parent = this;
    }
  }
  ReturnStatement.prototype = Object.create(Node);
  ReturnStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    if (typeof this.argument !== "undefined" && this.argument !== null) {
      this.argument = this.argument.codegen();
    }
    return this;
  };
  exports.ReturnStatement = ReturnStatement;
  return {};
});

//# sourceMappingURL=ReturnStatement.map
