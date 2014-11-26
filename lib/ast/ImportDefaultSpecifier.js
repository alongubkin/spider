System.register("ImportDefaultSpecifier", [], function() {
  "use strict";
  var __moduleName = "ImportDefaultSpecifier";
  function require(path) {
    return $traceurRuntime.require("ImportDefaultSpecifier", path);
  }
  "use strict";
  (function() {
    var Node = module.require("./Node").Node;
    function ImportDefaultSpecifier(id) {
      Node.call(this);
      this.type = "ImportDefaultSpecifier";
      this.id = id;
      this.id.parent = this;
    }
    ImportDefaultSpecifier.prototype = Object.create(Node);
    ImportDefaultSpecifier.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      this.id = this.id.codegen(false);
      this.getContext().node.defineIdentifier(this.id);
      return this;
    };
    exports.ImportDefaultSpecifier = ImportDefaultSpecifier;
  }());
  return {};
});
System.get("ImportDefaultSpecifier" + '');
