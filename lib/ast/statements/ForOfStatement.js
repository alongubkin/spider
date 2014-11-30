$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node,
      ForInStatement = module.require("./ForInStatement").ForInStatement;
  function ForOfStatement(key, value, object, body) {
    Node.call(this);
    this.type = "ForOfStatement";
    this.key = key;
    this.key.parent = this;
    this.value = value;
    if (typeof this.value !== "undefined" && this.value !== null) {
      this.value.parent = this;
    }
    this.object = object;
    this.object.parent = this;
    this.body = body;
    this.body.parent = this;
  }
  ForOfStatement.prototype = Object.create(Node);
  ForOfStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.object = this.object.codegen();
    if (typeof this.value !== "undefined" && this.value !== null) {
      this.value = this.value.codegen(false);
      this.body.defineIdentifier(this.value);
      if (this.object.hasCallExpression()) {
        var id = {
          "type": "Identifier",
          "name": exports.ForOfStatement.getNextVariableName()
        };
        var context = this.getContext();
        context.node.body.splice(context.position, 0, {
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
      this.body.body = [{
        "type": "VariableDeclaration",
        "codeGenerated": true,
        "declarations": [{
          "type": "VariableDeclarator",
          "id": this.value,
          "init": {
            "type": "MemberExpression",
            "computed": "true",
            "object": this.object,
            "property": this.key
          }
        }],
        "kind": "let"
      }].concat(this.body.body);
    }
    var forInLoop = new ForInStatement(this.key, null, {
      "type": "CallExpression",
      "codeGenerated": true,
      "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
          "type": "Identifier",
          "name": "Object"
        },
        "property": {
          "type": "Identifier",
          "name": "keys"
        }
      },
      "arguments": [this.object]
    }, this.body).codegen();
    this.type = forInLoop.type;
    this.right = forInLoop.right;
    this.left = forInLoop.left;
    this.each = forInLoop.each;
    return this;
  };
  ForOfStatement.getNextVariableName = function() {
    if (!this.forOfIndex) {
      this.forOfIndex = 0;
    }
    return "forOf" + this.forOfIndex++;
  };
  ForOfStatement.resetVariableNames = function() {
    this.forOfIndex = 0;
  };
  exports.ForOfStatement = ForOfStatement;
  return {};
});

//# sourceMappingURL=ForOfStatement.map
