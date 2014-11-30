$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function SplatExpression(expression) {
    Node.call(this);
    this.type = "SplatExpression";
    this.expression = expression;
    this.expression.parent = this;
  }
  SplatExpression.prototype = Object.create(Node);
  SplatExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.expression = this.expression.codegen();
    return {
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
          "name": "call"
        }
      },
      "arguments": [this.expression]
    };
  };
  SplatExpression.prototype.hasCallExpression = function() {
    return true;
  };
  exports.SplatExpression = SplatExpression;
  return {};
});

//# sourceMappingURL=SplatExpression.map
