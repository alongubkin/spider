$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  var Node = module.require("../Node").Node;
  function SwitchStatement(discriminant, cases) {
    Node.call(this);
    this.type = "SwitchStatement";
    this.discriminant = discriminant;
    this.discriminant.parent = this;
    this.cases = cases;
    for (var $__0 = this.cases[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var caseClause = $__1.value;
      {
        caseClause.parent = this;
      }
    }
  }
  SwitchStatement.prototype = Object.create(Node);
  SwitchStatement.prototype.codegen = function() {
    if (!Node.prototype.codegen.call(this)) {
      return;
    }
    var context = this.getContext();
    var firstCase,
        currentCase,
        defaultCase;
    var fallthroughPosition = 1;
    this.discriminant = this.discriminant.codegen();
    if (this.discriminant.hasCallExpression()) {
      var id = {
        "type": "Identifier",
        "name": SwitchStatement.getNextVariableName()
      };
      context.node.body.splice(context.position, 0, {
        "type": "VariableDeclaration",
        "codeGenerated": true,
        "declarations": [{
          "type": "VariableDeclarator",
          "id": id,
          "init": this.discriminant
        }],
        "kind": "let"
      });
      this.discriminant = id;
    }
    var hasFallthrough = false;
    for (var $__0 = this.cases[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var caseClause = $__1.value;
      {
        if (!caseClause.tests) {
          defaultCase = caseClause;
          break;
        }
        if (!(typeof firstCase !== "undefined" && firstCase !== null)) {
          firstCase = caseClause.codegen();
          currentCase = firstCase;
        } else {
          if (currentCase.fallthrough) {
            hasFallthrough = true;
            currentCase = caseClause.codegen(this.branchFallthrough);
            context.node.body.splice(context.position + fallthroughPosition++, 0, currentCase);
          } else {
            currentCase.alternate = caseClause.codegen(typeof this.fallthroughId !== "undefined" && this.fallthroughId !== null);
            currentCase = currentCase.alternate;
          }
        }
      }
    }
    if (hasFallthrough) {
      for (var $__2 = this.cases[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__3; !($__3 = $__2.next()).done; ) {
        var caseClause$__6 = $__3.value;
        {
          if (!caseClause$__6.fallthrough && !!(caseClause$__6 !== defaultCase)) {
            caseClause$__6.body.body = [{
              "type": "ExpressionStatement",
              "codeGenerated": true,
              "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": this.fallthroughId,
                "right": {
                  "type": "Literal",
                  "value": 2
                }
              }
            }].concat(caseClause$__6.body.body);
          }
        }
      }
    }
    if (typeof defaultCase !== "undefined" && defaultCase !== null) {
      if (!(typeof firstCase !== "undefined" && firstCase !== null)) {
        Node.getErrorManager().error({
          type: "SingleDefaultClause",
          message: "default clause without other case clauses is disallowed.",
          loc: defaultCase.loc
        });
      } else {
        if (currentCase.fallthrough) {
          defaultCase = defaultCase.codegen(typeof this.fallthroughId !== "undefined" && this.fallthroughId !== null);
          defaultCase.codeGenerated = true;
          if (typeof this.fallthroughId !== "undefined" && this.fallthroughId !== null) {
            context.node.body.splice(context.position + fallthroughPosition++, 0, defaultCase);
          } else {
            for (var $__4 = defaultCase.body[$traceurRuntime.toProperty(Symbol.iterator)](),
                $__5; !($__5 = $__4.next()).done; ) {
              var statement = $__5.value;
              {
                context.node.body.splice(context.position + fallthroughPosition++, 0, statement);
              }
            }
          }
        } else {
          currentCase.alternate = defaultCase.codegen(typeof this.fallthroughId !== "undefined" && this.fallthroughId !== null);
        }
      }
    }
    if (typeof this.fallthroughId !== "undefined" && this.fallthroughId !== null) {
      context.node.body.splice(context.position, 0, {
        "type": "VariableDeclaration",
        "codeGenerated": true,
        "declarations": [{
          "type": "VariableDeclarator",
          "id": this.fallthroughId,
          "init": {
            "type": "Literal",
            "value": 0
          }
        }],
        "kind": "let"
      });
    }
    if (!(typeof firstCase !== "undefined" && firstCase !== null)) {
      this.type = "ExpressionStatement";
      this.expression = this.discriminant;
    } else {
      this.type = firstCase.type;
      this.test = firstCase.test;
      this.consequent = firstCase.consequent;
      this.alternate = firstCase.alternate;
    }
    return this;
  };
  SwitchStatement.getNextVariableName = function() {
    if (!(typeof this.switchStatementIndex !== "undefined" && this.switchStatementIndex !== null)) {
      this.switchStatementIndex = 0;
    }
    return "switchStatement" + this.switchStatementIndex++;
  };
  SwitchStatement.resetVariableNames = function() {
    this.switchStatementIndex = 0;
  };
  exports.SwitchStatement = SwitchStatement;
  return {};
});

//# sourceMappingURL=SwitchStatement.map
