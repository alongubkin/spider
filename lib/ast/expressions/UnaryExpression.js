$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function UnaryExpression(operator, argument) {
    Node.call(this);
    this.type = "UnaryExpression";
    this.operator = operator;
    this.argument = argument;
    this.argument.parent = this;
    this.prefix = true;
  }
  UnaryExpression.prototype = Object.create(Node);
  UnaryExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.argument = this.argument.codegen();
    if (this.operator === "typeof") {
      var typeofExpression = {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "MemberExpression",
            "computed": true,
            "object": {
              "type": "CallExpression",
              "callee": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                  "type": "CallExpression",
                  "callee": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                      "type": "MemberExpression",
                      "computed": false,
                      "object": {
                        "type": "ObjectExpression",
                        "properties": []
                      },
                      "property": {
                        "type": "Identifier",
                        "name": "toString"
                      }
                    },
                    "property": {
                      "type": "Identifier",
                      "name": "call"
                    }
                  },
                  "arguments": [this.argument]
                },
                "property": {
                  "type": "Identifier",
                  "name": "match"
                }
              },
              "arguments": [{
                "type": "Literal",
                "value": new RegExp("\\s([a-zA-Z]+)")
              }]
            },
            "property": {
              "type": "Literal",
              "value": 1,
              "raw": "1"
            }
          },
          "property": {
            "type": "Identifier",
            "name": "toLowerCase"
          }
        },
        "arguments": []
      };
      if (!this.argument.hasCallExpression()) {
        this.type = "ConditionalExpression";
        this.test = {
          "type": "BinaryExpression",
          "operator": "===",
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
        this.consequent = {
          "type": "Literal",
          "value": "undefined"
        };
        this.alternate = typeofExpression;
      } else {
        this.type = typeofExpression.type;
        this.callee = typeofExpression.callee;
        Object.defineProperty(this, "arguments", {
          value: typeofExpression.arguments,
          enumerable: true
        });
      }
    } else {
      if (this.operator === "<-") {
        var parent = this.parent;
        while (!!(!!(typeof parent !== "undefined" && parent !== null) && !!(parent.type !== "FunctionExpression")) && !!(parent.type !== "GoStatement")) {
          parent = parent.parent;
        }
        if (!(typeof parent !== "undefined" && parent !== null) || !!(!!(parent.type !== "GoStatement") && !!(!!(parent.parent.type !== "UnaryExpression") || !!(parent.parent.operator !== "async")))) {
          Node.getErrorManager().error({
            type: "GetExpressionRequiresAsync",
            message: "unary <- must be in a go statement or an async function",
            loc: this.loc
          });
        }
        this.operator = "await";
        this.argument = {
          "type": "CallExpression",
          "callee": {
            "type": "MemberExpression",
            "object": this.argument,
            "property": {
              "type": "Identifier",
              "name": "get"
            },
            "computed": false
          },
          "arguments": []
        };
      }
    }
    return this;
  };
  UnaryExpression.prototype.hasCallExpression = function() {
    return typeof this.argument !== "undefined" && this.argument !== null ? this.argument.hasCallExpression() : void 0;
  };
  exports.UnaryExpression = UnaryExpression;
  return {};
});

//# sourceMappingURL=UnaryExpression.map
