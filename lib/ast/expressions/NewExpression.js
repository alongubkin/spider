$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function NewExpression(callee, args) {
    Node.call(this);
    this.type = "NewExpression";
    this.callee = callee;
    this.callee.parent = this;
    Object.defineProperty(this, "arguments", {
      value: args,
      enumerable: true
    });
    for (var $__0 = args[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var arg = $__1.value;
      {
        arg.parent = this;
      }
    }
  }
  NewExpression.prototype = Object.create(Node);
  NewExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.callee = this.callee.codegen();
    var args = this.arguments;
    var i = 0;
    for (var $__0 = args[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var arg = $__1.value;
      {
        args[i] = arg.codegen();
        i++;
      }
    }
    return this;
  };
  NewExpression.prototype.hasCallExpression = function() {
    return true;
  };
  exports.NewExpression = NewExpression;
  return {};
});

//# sourceMappingURL=NewExpression.map
