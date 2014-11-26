System.register("ThisExpression", [], function() {
  "use strict";
  var __moduleName = "ThisExpression";
  function require(path) {
    return $traceurRuntime.require("ThisExpression", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function ThisExpression() {
      Node.call(this);
      this.type = "ThisExpression";
    }
    ThisExpression.prototype = Object.create(Node);
    ThisExpression.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      return this;
    };
    ThisExpression.prototype.hasCallExpression = function() {
      return false;
    };
    exports.ThisExpression = ThisExpression;
  }());
  return {};
});
System.get("ThisExpression" + '');
