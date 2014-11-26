System.register("Identifier", [], function() {
  "use strict";
  var __moduleName = "Identifier";
  function require(path) {
    return $traceurRuntime.require("Identifier", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function Identifier(name) {
      Node.call(this);
      this.type = "Identifier";
      this.global = false;
      Object.defineProperty(this, "name", {
        value: name,
        enumerable: true
      });
    }
    Identifier.prototype = Object.create(Node);
    Identifier.prototype.codegen = function() {
      var undefinedCheck = arguments[0] !== (void 0) ? arguments[0] : true;
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      if (!!undefinedCheck && !this.global) {
        var inExpression1 = ["FunctionDeclaration", "VariableDeclarator"];
        if (!(!!(inExpression1 instanceof Array ? inExpression1.indexOf(typeof this.parent !== "undefined" && this.parent !== null ? this.parent.type : void 0) !== -1 : (typeof this.parent !== "undefined" && this.parent !== null ? this.parent.type : void 0) in inExpression1) && !!(this.parent.id === this))) {
          if (!this.parent.isIdentifierDefined(this.name)) {
            Node.getErrorManager().error({
              type: "UndefinedIdentifier",
              identifier: this.name,
              message: "undefined " + this.name,
              loc: this.loc
            });
          }
        } else {
          if (this.parent.isIdentifierDefined(this.name)) {
            Node.getErrorManager().error({
              type: "AlreadyDefinedIdentifier",
              identifier: this.name,
              message: this.name + " is already defined",
              loc: this.loc
            });
          } else {
            this.parent.getContext().node.defineIdentifier(this);
          }
        }
      }
      return this;
    };
    Identifier.prototype.hasCallExpression = function() {
      return false;
    };
    Identifier.prototype.asGlobal = function() {
      this.global = true;
      return this;
    };
    Identifier.prototype.asPredefinedCollection = function() {
      this.predefinedCollection = true;
      return this;
    };
    exports.Identifier = Identifier;
  }());
  return {};
});
System.get("Identifier" + '');
