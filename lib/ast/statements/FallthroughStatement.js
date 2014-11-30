$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function FallthroughStatement() {
    Node.call(this);
    this.type = "FallthroughStatement";
  }
  FallthroughStatement.prototype = Object.create(Node);
  FallthroughStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var parent = this.parent;
    var iterations = 0;
    while (!!(typeof parent !== "undefined" && parent !== null) && !parent.switchCase) {
      parent = parent.parent;
      iterations++;
    }
    if (typeof parent !== "undefined" && parent !== null) {
      parent.fallthrough = true;
    } else {
      Node.getErrorManager().error({
        type: "InvalidFallthroughContext",
        message: "fallthrough statement is only allowed in a switch case clause.",
        loc: this.loc
      });
    }
    var switchStatement = parent.parent;
    if (!switchStatement.fallthroughId) {
      switchStatement.fallthroughId = {
        "type": "Identifier",
        "name": FallthroughStatement.getNextVariableName()
      };
    }
    switchStatement.branchFallthrough = true;
    parent.body.body = [{
      "type": "ExpressionStatement",
      "codeGenerated": true,
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": switchStatement.fallthroughId,
        "right": {
          "type": "Literal",
          "value": 2
        }
      }
    }].concat(parent.body.body);
    this.type = "ExpressionStatement";
    this.expression = {
      "type": "AssignmentExpression",
      "operator": "=",
      "left": switchStatement.fallthroughId,
      "right": {
        "type": "Literal",
        "value": 1
      }
    };
    return this;
  };
  FallthroughStatement.getNextVariableName = function() {
    if (!(typeof this.fallthroughIndex !== "undefined" && this.fallthroughIndex !== null)) {
      this.fallthroughIndex = 0;
    }
    return "fallthrough" + this.fallthroughIndex++;
  };
  FallthroughStatement.resetVariableNames = function() {
    this.fallthroughIndex = 0;
  };
  exports.FallthroughStatement = FallthroughStatement;
  return {};
});

//# sourceMappingURL=FallthroughStatement.map
