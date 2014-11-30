$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function BinaryExpression(left, operator, right) {
    Node.call(this);
    this.type = "BinaryExpression";
    this.operator = operator;
    this.left = left;
    this.left.parent = this;
    this.right = right;
    this.right.parent = this;
  }
  BinaryExpression.prototype = Object.create(Node);
  BinaryExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var isRelational = function(operator) {
      var inExpression0 = [">", ">=", "<", ">="];
      return inExpression0 instanceof Array ? inExpression0.indexOf(operator) !== -1 : operator in inExpression0;
    };
    if (!!isRelational(this.operator) && !!isRelational(this.left.operator)) {
      this.type = "LogicalExpression";
      this.right = {
        "type": "BinaryExpression",
        "operator": this.operator,
        "left": this.left.right,
        "right": this.right.codegen()
      };
      this.left = this.left.codegen();
      this.operator = "&&";
    } else {
      this.left = this.left.codegen();
      this.right = this.right.codegen();
      if (this.operator === "==") {
        this.operator = "===";
      } else if (this.operator === "!=") {
        this.operator = "!==";
      } else if (this.operator === "**") {
        this.type = "CallExpression";
        this.callee = {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "Math"
          },
          "property": {
            "type": "Identifier",
            "name": "pow"
          }
        };
        Object.defineProperty(this, "arguments", {
          value: [this.left, this.right],
          enumerable: true
        });
      } else if (this.operator === "#") {
        this.type = "CallExpression";
        this.callee = {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "Math"
          },
          "property": {
            "type": "Identifier",
            "name": "floor"
          }
        };
        Object.defineProperty(this, "arguments", {
          value: [{
            "type": "BinaryExpression",
            "operator": "/",
            "left": this.left,
            "right": this.right
          }],
          enumerable: true
        });
      } else if (this.operator === "%%") {
        this.operator = "%";
        this.left = {
          "type": "BinaryExpression",
          "operator": "+",
          "left": {
            "type": "BinaryExpression",
            "operator": "%",
            "left": this.left,
            "right": this.right
          },
          "right": this.right
        };
      }
    }
    return this;
  };
  BinaryExpression.prototype.hasCallExpression = function() {
    return !!(typeof this.left !== "undefined" && this.left !== null ? this.left.hasCallExpression() : void 0) || !!(typeof this.right !== "undefined" && this.right !== null ? this.right.hasCallExpression() : void 0);
  };
  exports.BinaryExpression = BinaryExpression;
  return {};
});

//# sourceMappingURL=BinaryExpression.map
