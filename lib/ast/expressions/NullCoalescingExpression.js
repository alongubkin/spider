$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function NullCoalescingExpression(left, right) {
    Node.call(this);
    this.type = "NullCoalescingExpression";
    this.left = left;
    this.left.parent = this;
    this.right = right;
    this.right.parent = this;
  }
  NullCoalescingExpression.prototype = Object.create(Node);
  NullCoalescingExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var leftType = this.left.type;
    this.left = this.left.codegen();
    this.right = this.right.codegen();
    var context = this.getContext();
    var addUndefinedCheck = true;
    if (!!(!!(leftType === "NullPropagatingExpression") || !!(leftType === "NullCoalescingExpression")) || !!(typeof this.left.hasCallExpression === "function" ? this.left.hasCallExpression() : void 0)) {
      var id = {
        "type": "Identifier",
        "name": NullCoalescingExpression.getNextLeftName()
      };
      context.node.body.splice(context.position, 0, {
        "type": "VariableDeclaration",
        "declarations": [{
          "type": "VariableDeclarator",
          "id": id,
          "init": this.left
        }],
        "kind": "let",
        "codeGenerated": true
      });
      this.left = id;
      addUndefinedCheck = false;
    }
    var test = {
      "type": "BinaryExpression",
      "operator": "==",
      "left": this.left,
      "right": {
        "type": "Literal",
        "value": null,
        "raw": "null"
      }
    };
    if (this.left.type !== "Identifier") {
      addUndefinedCheck = false;
    }
    if (addUndefinedCheck) {
      test = {
        "type": "LogicalExpression",
        "operator": "||",
        "left": {
          "type": "BinaryExpression",
          "operator": "===",
          "left": {
            "type": "UnaryExpression",
            "operator": "typeof",
            "argument": this.left,
            "prefix": true
          },
          "right": {
            "type": "Literal",
            "value": "undefined",
            "raw": "'undefined'"
          }
        },
        "right": test
      };
    }
    if ((typeof this.parent !== "undefined" && this.parent !== null ? this.parent.type : void 0) === "ExpressionStatement") {
      if (!this.right.hasCallExpression()) {
        this.parent.type = "EmptyStatement";
        return this;
      }
      this.parent.type = "IfStatement";
      this.parent.test = test;
      this.parent.consequent = {
        "type": "BlockStatement",
        "body": [{
          "type": "ExpressionStatement",
          "expression": this.right
        }]
      };
    } else {
      return {
        "type": "ConditionalExpression",
        "test": test,
        "consequent": this.right,
        "alternate": this.left
      };
    }
  };
  NullCoalescingExpression.prototype.hasCallExpression = function() {
    return !!(typeof this.left !== "undefined" && this.left !== null ? this.left.hasCallExpression() : void 0) || !!(typeof this.right !== "undefined" && this.right !== null ? this.right.hasCallExpression() : void 0);
  };
  NullCoalescingExpression.getNextLeftName = function() {
    if (!(typeof this.nullCoalescingIndex !== "undefined" && this.nullCoalescingIndex !== null)) {
      this.nullCoalescingIndex = 0;
    }
    return "nullCoalescing" + this.nullCoalescingIndex++;
  };
  NullCoalescingExpression.resetVariableNames = function() {
    this.nullCoalescingIndex = 0;
  };
  exports.NullCoalescingExpression = NullCoalescingExpression;
  return {};
});

//# sourceMappingURL=NullCoalescingExpression.map
