$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
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
    var context = this.getContext().node;
    var i = 0;
    for (var $__0 = this.properties[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var property = $__1.value;
      {
        this.properties[i] = property.codegen();
        if (typeof property.value !== "undefined" && property.value !== null) {
          if (property.value.type === "Identifier") {
            context.defineIdentifier(property.value);
          }
        } else {
          if (property.key.type === "Identifier") {
            context.defineIdentifier(property.key);
          }
        }
        i++;
      }
    }
    return this;
  };
  ObjectPattern.prototype.hasCallExpression = function() {
    return true;
  };
  exports.ObjectPattern = ObjectPattern;
  return {};
});

//# sourceMappingURL=ObjectPattern.map
