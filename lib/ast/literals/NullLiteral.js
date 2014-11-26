System.register("NullLiteral", [], function() {
  "use strict";
  var __moduleName = "NullLiteral";
  function require(path) {
    return $traceurRuntime.require("NullLiteral", path);
  }
  "use strict";
  (function() {
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
  }());
  return {};
});
System.get("NullLiteral" + '');
