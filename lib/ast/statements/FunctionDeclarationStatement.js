$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node,
      Parameter = module.require("../Parameter").Parameter,
      CallExpression = module.require("../expressions/CallExpression").CallExpression;
  function FunctionDeclarationStatement(id, params, body, inheritsFrom) {
    Node.call(this);
    this.type = "FunctionDeclaration";
    this.defaults = [];
    this.rest = null;
    this.generator = false;
    this.expression = false;
    this.id = id;
    this.id.parent = this;
    this.body = body;
    this.body.parent = this;
    this.params = params;
    for (var $__0 = params[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var param = $__1.value;
      {
        param.parent = this;
      }
    }
    this.inheritsFrom = inheritsFrom;
    if (typeof this.inheritsFrom !== "undefined" && this.inheritsFrom !== null) {
      this.inheritsFrom.parent = this;
    }
  }
  FunctionDeclarationStatement.prototype = Object.create(Node);
  FunctionDeclarationStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.id = this.id.codegen();
    Parameter.generateFunctionBody(this, this.params, this.body, this.defaults);
    this.body = this.body.codegen();
    if (typeof this.inheritsFrom !== "undefined" && this.inheritsFrom !== null) {
      if (this.inheritsFrom.type !== "CallExpression") {
        this.inheritsFrom = new CallExpression(this.inheritsFrom, []);
        this.inheritsFrom.parent = this;
      }
      this.inheritsFrom = this.inheritsFrom.codegen();
      this.body.body.splice(0, 0, {
        "type": "ExpressionStatement",
        "expression": {
          "type": "CallExpression",
          "callee": {
            "type": "MemberExpression",
            "computed": false,
            "object": this.inheritsFrom.callee,
            "property": {
              "type": "Identifier",
              "name": "call"
            }
          },
          "arguments": [{"type": "ThisExpression"}].concat(this.inheritsFrom.arguments)
        }
      });
      var context = this.getContext();
      context.node.body.splice(context.position + 1, 0, {
        "type": "ExpressionStatement",
        "codeGenerated": "true",
        "expression": {
          "type": "AssignmentExpression",
          "operator": "=",
          "left": {
            "type": "MemberExpression",
            "computed": false,
            "object": this.id,
            "property": {
              "type": "Identifier",
              "name": "prototype"
            }
          },
          "right": {
            "type": "CallExpression",
            "callee": {
              "type": "MemberExpression",
              "computed": false,
              "object": {
                "type": "Identifier",
                "name": "Object"
              },
              "property": {
                "type": "Identifier",
                "name": "create"
              }
            },
            "arguments": [this.inheritsFrom.callee]
          }
        }
      });
    }
    return this;
  };
  FunctionDeclarationStatement.prototype.hasCallExpression = function() {
    return true;
  };
  exports.FunctionDeclarationStatement = FunctionDeclarationStatement;
  return {};
});

//# sourceMappingURL=FunctionDeclarationStatement.map
