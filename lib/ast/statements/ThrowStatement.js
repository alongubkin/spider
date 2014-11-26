System.register("ThrowStatement", [], function() {
  "use strict";
  var __moduleName = "ThrowStatement";
  function require(path) {
    return $traceurRuntime.require("ThrowStatement", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function ThrowStatement(argument) {
      Node.call(this);
      this.type = "ThrowStatement";
      this.argument = argument;
      this.argument.parent = this;
    }
    ThrowStatement.prototype = Object.create(Node);
    ThrowStatement.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      this.argument = this.argument.codegen();
      return this;
    };
    exports.ThrowStatement = ThrowStatement;
  }());
  return {};
});
System.get("ThrowStatement" + '');
