$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function ForStatement(init, test, update, body) {
    Node.call(this);
    this.type = "ForStatement";
    this.init = init;
    if (typeof this.init !== "undefined" && this.init !== null) {
      this.init.parent = this;
    }
    this.test = test;
    if (typeof this.test !== "undefined" && this.test !== null) {
      this.test.parent = this;
    }
    this.update = update;
    if (typeof this.update !== "undefined" && this.update !== null) {
      this.update.parent = this;
    }
    this.body = body;
    this.body.parent = this;
  }
  ForStatement.prototype = Object.create(Node);
  ForStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    if (typeof this.init !== "undefined" && this.init !== null) {
      this.init = this.init.codegen();
    }
    if (typeof this.test !== "undefined" && this.test !== null) {
      this.test = this.test.codegen();
    }
    if (typeof this.update !== "undefined" && this.update !== null) {
      this.update = this.update.codegen();
    }
    this.body = this.body.blockWrap().codegen();
    return this;
  };
  exports.ForStatement = ForStatement;
  return {};
});

//# sourceMappingURL=ForStatement.map
