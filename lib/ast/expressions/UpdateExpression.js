$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function UpdateExpression(argument, operator, prefix) {
    Node.call(this);
    this.type = "UpdateExpression";
    this.operator = operator;
    this.prefix = prefix;
    this.argument = argument;
    this.argument.parent = this;
  }
  UpdateExpression.prototype = Object.create(Node);
  UpdateExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    return this;
  };
  UpdateExpression.prototype.hasCallExpression = function() {
    return !!(this.argument !== null) && !!this.left.hasCallExpression();
  };
  exports.UpdateExpression = UpdateExpression;
  return {};
});

//# sourceMappingURL=UpdateExpression.map
//# sourceURL=src/ast/expressions/UpdateExpression.spider