$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function UseStatement(identifiers) {
    Node.call(this);
    this.type = "UseStatement";
    this.identifiers = identifiers;
    for (var $__0 = this.identifiers[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var id = $__1.value;
      {
        id.parent = this;
      }
    }
  }
  UseStatement.prototype = Object.create(Node);
  UseStatement.predefinedCollections = {
    "browser": ["document", "window", "screen", "location", "navigator", "alert", "console", "setTimeout"],
    "node": ["require", "exports", "module", "global", "console", "process", "setTimeout", "__dirname", "__filename"]
  };
  UseStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var context = this.getContext().node;
    for (var $__2 = this.identifiers[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__3; !($__3 = $__2.next()).done; ) {
      var id = $__3.value;
      {
        if (id.predefinedCollection) {
          for (var $__0 = exports.UseStatement.predefinedCollections[id.name][$traceurRuntime.toProperty(Symbol.iterator)](),
              $__1; !($__1 = $__0.next()).done; ) {
            var p = $__1.value;
            {
              context.defineIdentifier({name: p});
            }
          }
        } else {
          context.defineIdentifier(id);
        }
      }
    }
    return null;
  };
  exports.UseStatement = UseStatement;
  return {};
});

//# sourceMappingURL=UseStatement.map
