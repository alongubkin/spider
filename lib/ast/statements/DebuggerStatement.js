$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function DebuggerStatement() {
    Node.call(this);
    this.type = "DebuggerStatement";
  }
  DebuggerStatement.prototype = Object.create(Node);
  DebuggerStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    return this;
  };
  exports.DebuggerStatement = DebuggerStatement;
  return {};
});

//# sourceMappingURL=DebuggerStatement.map
