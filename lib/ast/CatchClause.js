$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("./Node").Node;
  function CatchClause(param, body) {
    Node.call(this);
    this.type = "CatchClause";
    this.param = param;
    this.param.parent = this;
    this.body = body;
    this.body.parent = this;
  }
  CatchClause.prototype = Object.create(Node);
  CatchClause.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.param = this.param.codegen(false);
    this.defineIdentifier(this.param);
    this.body = this.body.codegen();
    return this;
  };
  exports.CatchClause = CatchClause;
  return {};
});

//# sourceMappingURL=CatchClause.map
//# sourceURL=src/ast/CatchClause.spider