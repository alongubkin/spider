System.register("NullPropagatingExpression", [], function() {
  "use strict";
  var __moduleName = "NullPropagatingExpression";
  function require(path) {
    return $traceurRuntime.require("NullPropagatingExpression", path);
  }
  "use strict";
  (function() {
    var Node = module.require("../Node").Node;
    function NullPropagatingExpression(left, right) {
      Node.call(this);
      this.type = "NullPropagatingExpression";
      this.computed = false;
      this.object = left;
      this.object.parent = this;
      this.property = right;
      this.property.parent = this;
    }
    NullPropagatingExpression.prototype = Object.create(Node);
    NullPropagatingExpression.prototype.codegen = function() {
      if (!Node.prototype.codegen.call(this)) {
        return;
      }
      var context = this.getContext();
      var childType = this.object.type;
      this.object = this.object.codegen();
      this.property = this.property.codegen(false);
      if (typeof this.object.hasCallExpression === "function" ? this.object.hasCallExpression() : void 0) {
        var id = {
          "type": "Identifier",
          "name": NullPropagatingExpression.getNextObjectName(),
          "__member_expression": {
            "type": "MemberExpression",
            "object": this.object,
            "property": this.property,
            "computed": false
          }
        };
        context.node.body.splice(context.position + (NullPropagatingExpression.nullPropagatingIndex - 1), 0, {
          "type": "VariableDeclaration",
          "declarations": [{
            "type": "VariableDeclarator",
            "id": id,
            "init": this.object
          }],
          "kind": "let",
          "codeGenerated": true
        });
        this.object = id;
      }
      var condition;
      if (childType !== "NullPropagatingExpression") {
        condition = {
          "type": "BinaryExpression",
          "operator": "!==",
          "left": this.object,
          "right": {
            "type": "Literal",
            "value": null,
            "raw": "null"
          },
          "__member_expression": {
            "type": "MemberExpression",
            "object": this.object,
            "property": this.property,
            "computed": false
          },
          "__first_object": this.object
        };
      } else {
        condition = {
          "type": "LogicalExpression",
          "operator": "&&",
          "left": this.object,
          "right": {
            "type": "BinaryExpression",
            "operator": "!==",
            "left": {
              "type": "MemberExpression",
              "object": this.object.__member_expression.object,
              "property": this.object.__member_expression.property,
              "computed": false
            },
            "right": {
              "type": "Literal",
              "value": null,
              "raw": "null"
            }
          },
          "__member_expression": {
            "type": "MemberExpression",
            "object": this.object.__member_expression,
            "property": this.property,
            "computed": false
          },
          "__first_object": this.object.__first_object
        };
      }
      if ((typeof this.parent !== "undefined" && this.parent !== null ? this.parent.type : void 0) === "NullPropagatingExpression") {
        return condition;
      }
      condition = {
        "type": "LogicalExpression",
        "operator": "&&",
        "left": {
          "type": "BinaryExpression",
          "operator": "!==",
          "left": {
            "type": "UnaryExpression",
            "operator": "typeof",
            "argument": this.object.__first_object == null ? this.object : this.object.__first_object
          },
          "right": {
            "type": "Literal",
            "value": "undefined",
            "raw": "\"undefined\""
          }
        },
        "right": condition
      };
      condition = {
        "type": "ConditionalExpression",
        "test": condition,
        "consequent": {
          "type": "MemberExpression",
          "object": !!(this.object.type === "Identifier") || !this.object.__member_expression ? this.object : this.object.__member_expression,
          "property": this.property,
          "computed": false
        },
        "alternate": {
          "type": "UnaryExpression",
          "operator": "void",
          "argument": {
            "type": "Literal",
            "value": 0,
            "raw": "0"
          },
          "prefix": true
        },
        "__null_propagating": true
      };
      return condition;
    };
    NullPropagatingExpression.prototype.hasCallExpression = function() {
      return true;
    };
    NullPropagatingExpression.getNextObjectName = function() {
      if (!(typeof this.nullPropagatingIndex !== "undefined" && this.nullPropagatingIndex !== null)) {
        this.nullPropagatingIndex = 0;
        this.definedObjectNames = [];
      }
      var name = "nullPropagating" + this.nullPropagatingIndex++;
      this.definedObjectNames.push(name);
      return name;
    };
    NullPropagatingExpression.isObjectNameDefined = function(name) {
      return this.definedObjectNames.indexOf(name) !== -1;
    };
    NullPropagatingExpression.resetVariableNames = function() {
      this.nullPropagatingIndex = 0;
      this.definedObjectNames = [];
    };
    exports.NullPropagatingExpression = NullPropagatingExpression;
  }());
  return {};
});
System.get("NullPropagatingExpression" + '');
