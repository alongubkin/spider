System.register("NumberLiteral", [], function() {
  "use strict";
  var __moduleName = "NumberLiteral";
  function require(path) {
    return $traceurRuntime.require("NumberLiteral", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function NumberLiteral(text) {
      Node.call(this);
      this.type = "Literal";
      this.value = Number(text);
      this.raw = text;
    }
    NumberLiteral.prototype = Object.create(Node);
    NumberLiteral.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      return this;
    };
    NumberLiteral.prototype.hasCallExpression = function() {
      return false;
    };
    exports.NumberLiteral = NumberLiteral;
  }());
  return {};
});
System.get("NumberLiteral" + '');
