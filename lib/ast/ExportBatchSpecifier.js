System.register("ExportBatchSpecifier", [], function() {
  "use strict";
  var __moduleName = "ExportBatchSpecifier";
  function require(path) {
    return $traceurRuntime.require("ExportBatchSpecifier", path);
  }
  "use strict";
  (function() {
    var Node = module.require("./Node").Node;
    function ExportBatchSpecifier() {
      Node.call(this);
      this.type = "ExportBatchSpecifier";
    }
    ExportBatchSpecifier.prototype = Object.create(Node);
    ExportBatchSpecifier.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      return this;
    };
    exports.ExportBatchSpecifier = ExportBatchSpecifier;
  }());
  return {};
});
System.get("ExportBatchSpecifier" + '');
