$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("./Node").Node;
  function VariableDeclarator(id, init) {
    Node.call(this);
    this.type = "VariableDeclarator";
    this.id = id;
    this.id.parent = this;
    this.init = init;
    if (typeof this.init !== "undefined" && this.init !== null) {
      this.init.parent = this;
    }
  }
  VariableDeclarator.prototype = Object.create(Node);
  VariableDeclarator.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    if (typeof this.init !== "undefined" && this.init !== null) {
      this.init = this.init.codegen();
    }
    this.id = this.id.codegen();
    return this;
  };
  exports.VariableDeclarator = VariableDeclarator;
  return {};
});

//# sourceMappingURL=VariableDeclarator.map
