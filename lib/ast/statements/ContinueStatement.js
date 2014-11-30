$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function ContinueStatement() {
    Node.call(this);
    this.type = "ContinueStatement";
  }
  ContinueStatement.prototype = Object.create(Node);
  ContinueStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    return this;
  };
  exports.ContinueStatement = ContinueStatement;
  return {};
});

//# sourceMappingURL=ContinueStatement.map
