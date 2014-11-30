$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function BreakStatement() {
    Node.call(this);
    this.type = "BreakStatement";
  }
  BreakStatement.prototype = Object.create(Node);
  BreakStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    return this;
  };
  exports.BreakStatement = BreakStatement;
  return {};
});

//# sourceMappingURL=BreakStatement.map
