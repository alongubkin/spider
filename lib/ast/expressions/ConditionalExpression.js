System.register("ConditionalExpression", [], function() {
  "use strict";
  var __moduleName = "ConditionalExpression";
  function require(path) {
    return $traceurRuntime.require("ConditionalExpression", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function ConditionalExpression(test, consequent, alternate) {
      Node.call(this);
      this.type = "ConditionalExpression";
      this.test = test;
      this.test.parent = this;
      this.consequent = consequent;
      this.consequent.parent = this;
      this.alternate = alternate;
      this.alternate.parent = this;
    }
    ConditionalExpression.prototype = Object.create(Node);
    ConditionalExpression.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      this.test = this.test.codegen();
      this.consequent = this.consequent.codegen();
      this.alternate = this.alternate.codegen();
      return this;
    };
    ConditionalExpression.prototype.hasCallExpression = function() {
      return true;
    };
    exports.ConditionalExpression = ConditionalExpression;
  }());
  return {};
});
System.get("ConditionalExpression" + '');
