$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function ExistentialExpression(argument) {
    Node.call(this);
    this.type = "ExistentialExpression";
    this.argument = argument;
    this.argument.parent = this;
  }
  ExistentialExpression.prototype = Object.create(Node);
  ExistentialExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var nullCoalescing0 = typeof this.argument.hasCallExpression === "function" ? this.argument.hasCallExpression() : void 0;
    var isArgumentCallExpression = nullCoalescing0 == null ? false : nullCoalescing0;
    this.argument = this.argument.codegen();
    if (isArgumentCallExpression) {
      var context = this.getContext();
      var id = {
        "type": "Identifier",
        "name": ExistentialExpression.getNextVariableName()
      };
      context.node.body.splice(context.position + (ExistentialExpression.existentialIndex - 2), 0, {
        "type": "VariableDeclaration",
        "declarations": [{
          "type": "VariableDeclarator",
          "id": id,
          "init": this.argument
        }],
        "kind": "let",
        "codeGenerated": true
      });
      this.argument = id;
    }
    var nullCheck = {
      "type": "BinaryExpression",
      "operator": "!==",
      "left": this.argument,
      "right": {
        "type": "Literal",
        "value": null,
        "raw": "null"
      }
    };
    this.type = "LogicalExpression";
    this.operator = "&&";
    this.left = {
      "type": "BinaryExpression",
      "operator": "!==",
      "left": {
        "type": "UnaryExpression",
        "operator": "typeof",
        "argument": this.argument,
        "prefix": true
      },
      "right": {
        "type": "Literal",
        "value": "undefined",
        "raw": "'undefined'"
      }
    };
    this.right = nullCheck;
    return this;
  };
  ExistentialExpression.prototype.hasCallExpression = function() {
    var nullCoalescing1 = typeof this.argument !== "undefined" && this.argument !== null && typeof this.argument.hasCallExpression === "function" ? this.argument.hasCallExpression() : void 0;
    return nullCoalescing1 == null ? false : nullCoalescing1;
  };
  ExistentialExpression.getNextVariableName = function() {
    if (!(typeof this.existentialIndex !== "undefined" && this.existentialIndex !== null)) {
      this.existentialIndex = 0;
    }
    return "existential" + this.existentialIndex++;
  };
  ExistentialExpression.resetVariableNames = function() {
    this.existentialIndex = 0;
  };
  exports.ExistentialExpression = ExistentialExpression;
  return {};
});

//# sourceMappingURL=ExistentialExpression.map
