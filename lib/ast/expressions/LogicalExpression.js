$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function LogicalExpression(left, operator, right) {
    Node.call(this);
    this.type = "LogicalExpression";
    this.operator = operator;
    if (this.operator === "and") {
      this.operator = "&&";
    } else if (this.operator === "or") {
      this.operator = "||";
    }
    this.left = left;
    this.left.parent = this;
    this.right = right;
    this.right.parent = this;
  }
  LogicalExpression.prototype = Object.create(Node);
  LogicalExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var enforceBooleanExpression = function(o) {
      if (!!(o.type === "UnaryExpression") && !!(o.operator === "!")) {
        return o;
      }
      return {
        "type": "UnaryExpression",
        "operator": "!",
        "argument": {
          "type": "UnaryExpression",
          "operator": "!",
          "argument": o,
          "prefix": true
        },
        "prefix": true
      };
    };
    this.left = enforceBooleanExpression(this.left.codegen());
    this.right = enforceBooleanExpression(this.right.codegen());
    return this;
  };
  LogicalExpression.prototype.hasCallExpression = function() {
    return !!(typeof this.left !== "undefined" && this.left !== null ? this.left.hasCallExpression() : void 0) || !!(typeof this.right !== "undefined" && this.right !== null ? this.right.hasCallExpression() : void 0);
  };
  exports.LogicalExpression = LogicalExpression;
  return {};
});

//# sourceMappingURL=LogicalExpression.map
