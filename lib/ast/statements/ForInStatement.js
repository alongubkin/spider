$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function ForInStatement(item, index, array, body) {
    Node.call(this);
    this.type = "ForInStatement";
    this.item = item;
    this.item.parent = this;
    this.index = index;
    if (typeof this.index !== "undefined" && this.index !== null) {
      this.index.parent = this;
    }
    this.array = array;
    this.array.parent = this;
    this.body = body;
    this.body.parent = this;
  }
  ForInStatement.prototype = Object.create(Node);
  ForInStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.item = this.item.codegen(false);
    if (typeof this.index !== "undefined" && this.index !== null) {
      var context = this.getContext();
      this.index = this.index.codegen(false);
      context.node.body.splice(context.position, 0, {
        "type": "VariableDeclaration",
        "declarations": [{
          "type": "VariableDeclarator",
          "id": this.index,
          "init": {
            "type": "Literal",
            "value": 0
          }
        }],
        "kind": "let"
      });
    }
    if (!this.array.codeGenerated) {
      this.array = this.array.codegen();
    }
    this.body = this.body.blockWrap();
    this.body.defineIdentifier(this.item);
    if (typeof this.index !== "undefined" && this.index !== null) {
      this.body.defineIdentifier(this.index);
    }
    this.body = this.body.codegen();
    if (typeof this.index !== "undefined" && this.index !== null) {
      this.body.body.push({
        "type": "ExpressionStatement",
        "codeGenerated": true,
        "expression": {
          "type": "UpdateExpression",
          "operator": "++",
          "argument": this.index,
          "prefix": false
        }
      });
    }
    this.type = "ForOfStatement";
    this.right = this.array;
    this.left = {
      "type": "VariableDeclaration",
      "declarations": [{
        "type": "VariableDeclarator",
        "id": this.item,
        "init": null
      }],
      "kind": "let"
    };
    this.each = false;
    return this;
  };
  exports.ForInStatement = ForInStatement;
  return {};
});

//# sourceMappingURL=ForInStatement.map
