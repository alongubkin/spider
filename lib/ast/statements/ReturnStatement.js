System.register("ReturnStatement", [], function() {
  "use strict";
  var __moduleName = "ReturnStatement";
  function require(path) {
    return $traceurRuntime.require("ReturnStatement", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function ReturnStatement(argument) {
      Node.call(this);
      this.type = "ReturnStatement";
      this.argument = argument;
      if (typeof this.argument !== "undefined" && this.argument !== null) {
        this.argument.parent = this;
      }
    }
    ReturnStatement.prototype = Object.create(Node);
    ReturnStatement.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      if (typeof this.argument !== "undefined" && this.argument !== null) {
        this.argument = this.argument.codegen();
      }
      return this;
    };
    exports.ReturnStatement = ReturnStatement;
  }());
  return {};
});
System.get("ReturnStatement" + '');
