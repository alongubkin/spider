System.register("BreakStatement", [], function() {
  "use strict";
  var __moduleName = "BreakStatement";
  function require(path) {
    return $traceurRuntime.require("BreakStatement", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function BreakStatement() {
      Node.call(this);
      this.type = "BreakStatement";
    }
    BreakStatement.prototype = Object.create(Node);
    BreakStatement.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      return this;
    };
    exports.BreakStatement = BreakStatement;
  }());
  return {};
});
System.get("BreakStatement" + '');
