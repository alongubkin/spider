$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node,
      ForInStatement = module.require("../statements/ForInStatement").ForInStatement,
      BlockStatement = module.require("../statements/BlockStatement").BlockStatement;
  function ForInExpression(expression, item, index, array, condition) {
    Node.call(this);
    this.type = "ForInExpression";
    this.expression = expression;
    this.expression.parent = this;
    this.item = item;
    this.item.parent = this;
    this.index = index;
    if (typeof this.index !== "undefined" && this.index !== null) {
      this.index.parent = this;
    }
    this.array = array;
    this.array.parent = this;
    this.condition = condition;
    if (typeof this.condition !== "undefined" && this.condition !== null) {
      this.condition.parent = this;
    }
  }
  ForInExpression.prototype = Object.create(Node);
  ForInExpression.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    this.defineIdentifier(this.item);
    if (typeof this.index !== "undefined" && this.index !== null) {
      this.defineIdentifier(this.index);
    }
    var id = {
      "type": "Identifier",
      "name": ForInExpression.getNextVariableName(),
      "codeGenerated": true
    };
    var pushStatement = {
      "type": "ExpressionStatement",
      "codeGenerated": true,
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": id,
          "property": {
            "type": "Identifier",
            "name": "push"
          }
        },
        "arguments": [this.expression.codegen()]
      }
    };
    if (typeof this.condition !== "undefined" && this.condition !== null) {
      pushStatement = {
        "type": "IfStatement",
        "codeGenerated": true,
        "test": this.condition.codegen(),
        "consequent": {
          "type": "BlockStatement",
          "body": [pushStatement]
        },
        "alternate": null
      };
    }
    var forInStatement = new ForInStatement(this.item, this.index, this.array, new BlockStatement([pushStatement]));
    var fnBlock = new BlockStatement([{
      "type": "VariableDeclaration",
      "declarations": [{
        "type": "VariableDeclarator",
        "id": id,
        "init": {
          "type": "ArrayExpression",
          "elements": []
        }
      }],
      "kind": "let",
      "codeGenerated": true
    }, forInStatement, {
      "type": "ReturnStatement",
      "codeGenerated": true,
      "argument": id
    }]);
    forInStatement.parent = fnBlock;
    this.type = "CallExpression";
    this.callee = {
      "type": "FunctionExpression",
      "id": null,
      "params": [],
      "defaults": [],
      "body": fnBlock.codegen()
    };
    Object.defineProperty(this, "arguments", {
      value: [],
      enumerable: true
    });
    return this;
  };
  ForInExpression.prototype.hasCallExpression = function() {
    return true;
  };
  ForInExpression.getNextVariableName = function() {
    if (!(typeof this.forInIndex !== "undefined" && this.forInIndex !== null)) {
      this.forInIndex = 0;
    }
    return "forIn" + this.forInIndex++;
  };
  ForInExpression.resetVariableNames = function() {
    this.forInIndex = 0;
  };
  exports.ForInExpression = ForInExpression;
  return {};
});

//# sourceMappingURL=ForInExpression.map
