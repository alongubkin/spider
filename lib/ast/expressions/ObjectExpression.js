$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function ObjectExpression(properties) {
    Node.call(this);
    this.type = "ObjectExpression";
    this.properties = properties;
    for (var $__0 = this.properties[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var property = $__1.value;
      {
        property.parent = this;
      }
    }
  }
  ObjectExpression.prototype = Object.create(Node);
  ObjectExpression.prototype.codegen = function() {
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
  ObjectExpression.prototype.hasCallExpression = function() {
    return true;
  };
  exports.ObjectExpression = ObjectExpression;
  return {};
});

//# sourceMappingURL=ObjectExpression.map
