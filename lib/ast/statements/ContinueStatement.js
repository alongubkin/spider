System.register("ContinueStatement", [], function() {
  "use strict";
  var __moduleName = "ContinueStatement";
  function require(path) {
    return $traceurRuntime.require("ContinueStatement", path);
  }
  "use strict";
  (function() {
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
  }());
  return {};
});
System.get("ContinueStatement" + '');
