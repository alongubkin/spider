System.register("ImportNamespaceSpecifier", [], function() {
  "use strict";
  var __moduleName = "ImportNamespaceSpecifier";
  function require(path) {
    return $traceurRuntime.require("ImportNamespaceSpecifier", path);
  }
  "use strict";
  (function() {
    var Node = module.require("./Node").Node;
    function ImportNamespaceSpecifier(id) {
      Node.call(this);
      this.type = "ImportNamespaceSpecifier";
      this.id = id;
      this.id.parent = this;
    }
    ImportNamespaceSpecifier.prototype = Object.create(Node);
    ImportNamespaceSpecifier.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      this.id = this.id.codegen(false);
      this.getContext().node.defineIdentifier(this.id);
      return this;
    };
    exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
  }());
  return {};
});
System.get("ImportNamespaceSpecifier" + '');
