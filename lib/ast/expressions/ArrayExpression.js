System.register("ArrayExpression", [], function() {
  "use strict";
  var __moduleName = "ArrayExpression";
  function require(path) {
    return $traceurRuntime.require("ArrayExpression", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function ArrayExpression(elements) {
      Node.call(this);
      this.type = "ArrayExpression";
      this.elements = elements;
      for (var $__0 = this.elements[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var element = $__1.value;
        {
          if (typeof element !== "undefined" && element !== null) {
            element.parent = this;
          }
        }
      }
    }
    ArrayExpression.prototype = Object.create(Node);
    ArrayExpression.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      var i = 0;
      for (var $__0 = this.elements[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var element = $__1.value;
        {
          this.elements[i] = typeof element !== "undefined" && element !== null ? element.codegen() : void 0;
          i++;
        }
      }
      return this;
    };
    ArrayExpression.prototype.hasCallExpression = function() {
      return true;
    };
    exports.ArrayExpression = ArrayExpression;
  }());
  return {};
});
System.get("ArrayExpression" + '');
