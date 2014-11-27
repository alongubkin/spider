System.register("ArrayPattern", [], function() {
  "use strict";
  var __moduleName = "ArrayPattern";
  function require(path) {
    return $traceurRuntime.require("ArrayPattern", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function ArrayPattern(elements) {
      Node.call(this);
      this.type = "ArrayPattern";
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
    ArrayPattern.prototype = Object.create(Node);
    ArrayPattern.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      var context = this.getContext().node;
      var i = 0;
      for (var $__0 = this.elements[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var element = $__1.value;
        {
          this.elements[i] = typeof element !== "undefined" && element !== null ? element.codegen(false) : void 0;
          if (!!(typeof element !== "undefined" && element !== null) && !!(element.type === "Identifier")) {
            context.defineIdentifier(element);
          }
          i++;
        }
      }
      return this;
    };
    ArrayPattern.prototype.hasCallExpression = function() {
      return true;
    };
    exports.ArrayPattern = ArrayPattern;
  }());
  return {};
});
System.get("ArrayPattern" + '');
