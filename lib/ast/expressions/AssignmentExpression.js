System.register("AssignmentExpression", [], function() {
  "use strict";
  var __moduleName = "AssignmentExpression";
  function require(path) {
    return $traceurRuntime.require("AssignmentExpression", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function AssignmentExpression(left, operator, right) {
      Node.call(this);
      this.type = "AssignmentExpression";
      this.operator = operator;
      this.left = left;
      this.left.parent = this;
      this.right = right;
      this.right.parent = this;
    }
    AssignmentExpression.prototype = Object.create(Node);
    AssignmentExpression.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      this.left = this.left.codegen();
      this.right = this.right.codegen();
      return this;
    };
    AssignmentExpression.prototype.hasCallExpression = function() {
      return !!(typeof this.left !== "undefined" && this.left !== null ? this.left.hasCallExpression() : void 0) || !!(typeof this.right !== "undefined" && this.right !== null ? this.right.hasCallExpression() : void 0);
    };
    exports.AssignmentExpression = AssignmentExpression;
  }());
  return {};
});
System.get("AssignmentExpression" + '');
