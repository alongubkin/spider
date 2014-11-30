$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function ThrowStatement(argument) {
    Node.call(this);
    this.type = "ThrowStatement";
    this.argument = argument;
    this.argument.parent = this;
  }
  ThrowStatement.prototype = Object.create(Node);
  ThrowStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.argument = this.argument.codegen();
    return this;
  };
  exports.ThrowStatement = ThrowStatement;
  return {};
});

//# sourceMappingURL=ThrowStatement.map
