$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function MemberExpression(left, right, computed) {
    Node.call(this);
    this.type = "MemberExpression";
    this.computed = computed;
    this.object = left;
    this.object.parent = this;
    this.property = right;
    this.property.parent = this;
  }
  MemberExpression.prototype = Object.create(Node);
  MemberExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var objectType = this.object.type;
    this.object = this.object.codegen();
    if (!this.property.codeGenerated) {
      this.property = this.property.codegen(false);
    }
    if (!!(this.object.type === "ConditionalExpression") && !!(!!(!!(!!(objectType === "NullPropagatingExpression") || !!(objectType === "MemberExpression")) || !!(objectType === "CallExpression")) || !!(objectType === "NullCheckCallExpression"))) {
      this.type = this.object.type;
      this.test = this.object.test;
      this.alternate = this.object.alternate;
      this.consequent = {
        type: "MemberExpression",
        object: this.object.consequent,
        property: this.property,
        computed: this.computed
      };
    }
    return this;
  };
  MemberExpression.prototype.hasCallExpression = function() {
    return !!(!!this.object.__null_propagating || !!(typeof this.object !== "undefined" && this.object !== null && typeof this.object.hasCallExpression === "function" ? this.object.hasCallExpression() : void 0)) || !!(typeof this.property !== "undefined" && this.property !== null ? this.property.hasCallExpression() : void 0);
  };
  exports.MemberExpression = MemberExpression;
  return {};
});

//# sourceMappingURL=MemberExpression.map
