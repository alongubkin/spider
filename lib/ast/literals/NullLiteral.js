$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function NullLiteral() {
    Node.call(this);
    this.type = "Literal";
    this.value = null;
    this.raw = "null";
  }
  NullLiteral.prototype = Object.create(Node);
  NullLiteral.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    return this;
  };
  NullLiteral.prototype.hasCallExpression = function() {
    return false;
  };
  exports.NullLiteral = NullLiteral;
  return {};
});

//# sourceMappingURL=NullLiteral.map
