$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("./Node").Node;
  function ExportSpecifier(id, alias) {
    Node.call(this);
    this.type = "ExportSpecifier";
    this.id = id;
    this.id.parent = this;
    if (typeof alias !== "undefined" && alias !== null) {
      this.alias = alias;
      this.alias.parent = this;
    }
  }
  ExportSpecifier.prototype = Object.create(Node);
  ExportSpecifier.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.id = this.id.codegen(false);
    Object.defineProperty(this, "name", {
      value: typeof this.alias !== "undefined" && this.alias !== null ? {
        "type": "Identifier",
        "name": this.alias.name
      } : null,
      enumerable: true
    });
    return this;
  };
  exports.ExportSpecifier = ExportSpecifier;
  return {};
});

//# sourceMappingURL=ExportSpecifier.map
