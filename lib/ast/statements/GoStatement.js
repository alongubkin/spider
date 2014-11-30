$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function GoStatement(body) {
    Node.call(this);
    this.type = "GoStatement";
    this.body = body;
    this.body.parent = this;
  }
  GoStatement.prototype = Object.create(Node);
  GoStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.body = this.body.codegen();
    this.type = "ExpressionStatement";
    this.expression = {
      "type": "CallExpression",
      "callee": {
        "type": "UnaryExpression",
        "operator": "async",
        "argument": {
          "type": "FunctionExpression",
          "id": null,
          "params": [],
          "defaults": [],
          "body": this.body,
          "rest": null,
          "generator": false,
          "expression": false
        }
      },
      "arguments": []
    };
    return this;
  };
  exports.GoStatement = GoStatement;
  return {};
});

//# sourceMappingURL=GoStatement.map
