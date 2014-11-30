$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function PushStatement(left, right) {
    Node.call(this);
    this.type = "PushStatement";
    this.left = left;
    this.left.parent = this;
    this.right = right;
    this.right.parent = this;
  }
  PushStatement.prototype = Object.create(Node);
  PushStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.type = "ExpressionStatement";
    this.expression = {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "object": this.left.codegen(),
        "property": {
          "type": "Identifier",
          "name": "push"
        },
        "computed": false
      },
      "arguments": [this.right.codegen()]
    };
    return this;
  };
  exports.PushStatement = PushStatement;
  return {};
});

//# sourceMappingURL=PushStatement.map
