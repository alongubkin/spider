System.register("ObjectPattern", [], function() {
  "use strict";
  var __moduleName = "ObjectPattern";
  function require(path) {
    return $traceurRuntime.require("ObjectPattern", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function ObjectPattern(properties) {
      Node.call(this);
      this.type = "ObjectPattern";
      this.properties = properties;
      for (var $__0 = this.properties[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var property = $__1.value;
        {
          property.parent = this;
        }
      }
    }
    ObjectPattern.prototype = Object.create(Node);
    ObjectPattern.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      var i = 0;
      for (var $__0 = this.properties[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var property = $__1.value;
        {
          this.properties[i] = property.codegen();
          i++;
        }
      }
      return this;
    };
    ObjectPattern.prototype.hasCallExpression = function() {
      return true;
    };
    exports.ObjectPattern = ObjectPattern;
  }());
  return {};
});
System.get("ObjectPattern" + '');
