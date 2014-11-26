System.register("DebuggerStatement", [], function() {
  "use strict";
  var __moduleName = "DebuggerStatement";
  function require(path) {
    return $traceurRuntime.require("DebuggerStatement", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function DebuggerStatement() {
      Node.call(this);
      this.type = "DebuggerStatement";
    }
    DebuggerStatement.prototype = Object.create(Node);
    DebuggerStatement.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      return this;
    };
    exports.DebuggerStatement = DebuggerStatement;
  }());
  return {};
});
System.get("DebuggerStatement" + '');
