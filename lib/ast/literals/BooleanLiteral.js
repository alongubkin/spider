System.register("BooleanLiteral", [], function() {
  "use strict";
  var __moduleName = "BooleanLiteral";
  function require(path) {
    return $traceurRuntime.require("BooleanLiteral", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function BooleanLiteral(text) {
      Node.call(this);
      this.type = "Literal";
      this.value = text === "true";
      this.raw = text;
    }
    BooleanLiteral.prototype = Object.create(Node);
    BooleanLiteral.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      return this;
    };
    BooleanLiteral.prototype.hasCallExpression = function() {
      return false;
    };
    exports.BooleanLiteral = BooleanLiteral;
  }());
  return {};
});
System.get("BooleanLiteral" + '');
