$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function TryStatement(block, handler, finalizer) {
    Node.call(this);
    this.type = "TryStatement";
    this.block = block;
    this.block.parent = this;
    this.handler = handler;
    if (typeof this.handler !== "undefined" && this.handler !== null) {
      this.handler.parent = this;
    }
    this.finalizer = finalizer;
    if (typeof this.finalizer !== "undefined" && this.finalizer !== null) {
      this.finalizer.parent = this;
    }
  }
  TryStatement.prototype = Object.create(Node);
  TryStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.block = this.block.codegen();
    if (typeof this.handler !== "undefined" && this.handler !== null) {
      this.handler = this.handler.codegen();
    }
    if (typeof this.finalizer !== "undefined" && this.finalizer !== null) {
      this.finalizer = this.finalizer.codegen();
    }
    return this;
  };
  exports.TryStatement = TryStatement;
  return {};
});

//# sourceMappingURL=TryStatement.map
