$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node,
      CallExpression = module.require("./CallExpression").CallExpression;
  function CurryCallExpression(callee, args) {
    Node.call(this);
    this.type = "CurryCallExpression";
    this.callee = callee;
    this.args = args;
  }
  CurryCallExpression.prototype = Object.create(Node);
  CurryCallExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var call = new CallExpression(this.callee, this.args);
    call.parent = this;
    call = call.codegen();
    if (!!(call.type !== "CallExpression") || !!(!!((typeof call !== "undefined" && call !== null ? call.callee.type : void 0) === "MemberExpression") && !!((typeof call !== "undefined" && call !== null ? call.callee.property.name : void 0) === "apply"))) {
      Node.getErrorManager().error({
        type: "InvalidFunctionCurrying",
        message: "currying functions with existential operator or splats is disallowed.",
        loc: this.loc
      });
    }
    this.type = "FunctionExpression";
    this.id = null;
    this.params = [];
    this.defaults = [];
    this.body = {
      "type": "BlockStatement",
      "body": [{
        "type": "ReturnStatement",
        "argument": {
          "type": "CallExpression",
          "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": call.callee,
            "property": {
              "type": "Identifier",
              "name": "apply"
            }
          },
          "arguments": [{"type": "ThisExpression"}, {
            "type": "CallExpression",
            "callee": {
              "type": "MemberExpression",
              "computed": false,
              "object": {
                "type": "ArrayExpression",
                "elements": call.arguments
              },
              "property": {
                "type": "Identifier",
                "name": "concat"
              }
            },
            "arguments": [{
              "type": "CallExpression",
              "callee": {
                "type": "MemberExpression",
                "computed": false,
                "object": {
                  "type": "MemberExpression",
                  "computed": false,
                  "object": {
                    "type": "ArrayExpression",
                    "elements": []
                  },
                  "property": {
                    "type": "Identifier",
                    "name": "slice"
                  }
                },
                "property": {
                  "type": "Identifier",
                  "name": "apply"
                }
              },
              "arguments": [{
                "type": "Identifier",
                "name": "arguments"
              }]
            }]
          }]
        }
      }]
    };
    this.rest = null;
    this.generator = false;
    this.expression = false;
    return this;
  };
  CurryCallExpression.prototype.hasCallExpression = function() {
    return true;
  };
  exports.CurryCallExpression = CurryCallExpression;
  return {};
});

//# sourceMappingURL=CurryCallExpression.map
