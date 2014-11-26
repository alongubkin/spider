System.register("RegularExpressionLiteral", [], function() {
  "use strict";
  var __moduleName = "RegularExpressionLiteral";
  function require(path) {
    return $traceurRuntime.require("RegularExpressionLiteral", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function RegularExpressionLiteral(pattern, flags) {
      Node.call(this);
      this.type = "Literal";
      this.pattern = pattern;
      this.flags = flags;
    }
    RegularExpressionLiteral.prototype = Object.create(Node);
    RegularExpressionLiteral.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      this.value = new RegExp(this.pattern, this.flags);
      return this;
    };
    RegularExpressionLiteral.prototype.hasCallExpression = function() {
      return false;
    };
    exports.RegularExpressionLiteral = RegularExpressionLiteral;
  }());
  return {};
});
System.get("RegularExpressionLiteral" + '');
