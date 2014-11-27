System.register("UndefinedLiteral", [], function() {
  "use strict";
  var __moduleName = "UndefinedLiteral";
  function require(path) {
    return $traceurRuntime.require("UndefinedLiteral", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function UndefinedLiteral() {
      Node.call(this);
      this.type = "UndefinedLiteral";
    }
    UndefinedLiteral.prototype = Object.create(Node);
    UndefinedLiteral.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      this.type = "UnaryExpression";
      this.operator = "void";
      this.argument = {
        "type": "Literal",
        "value": 0,
        "raw": "0"
      };
      this.prefix = true;
      return this;
    };
    UndefinedLiteral.prototype.hasCallExpression = function() {
      return false;
    };
    exports.UndefinedLiteral = UndefinedLiteral;
  }());
  return {};
});
System.get("UndefinedLiteral" + '');
