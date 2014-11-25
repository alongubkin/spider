"use strict";
(function () {
    var Node = require("../Node").Node;
    function SwitchStatement(discriminant, cases) {
        Node.call(this);
        this.type = "SwitchStatement";
        this.discriminant = discriminant;
        this.discriminant.parent = this;
        this.cases = cases;
        this.cases.every(function (caseClause) {
            caseClause.parent = this;
            return true;
        }, this);
    }
    SwitchStatement.prototype = Object.create(Node);
    SwitchStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        var context = this.getContext();
        var firstCase, currentCase, defaultCase;
        var fallthroughPosition = 1;
        this.discriminant = this.discriminant.codegen();
        var hasFallthrough = false;
        this.cases.every(function (caseClause) {
            if (!caseClause.tests) {
                defaultCase = caseClause;
                return false;
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
            return true;
        }, this);
        if (hasFallthrough) {
            this.cases.every(function (caseClause) {
                if (!caseClause.fallthrough && !!(caseClause !== defaultCase)) {
                    caseClause.body.body = [{
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
                        }].concat(caseClause.body.body);
                }
                return true;
            }, this);
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
                        defaultCase.body.every(function (statement) {
                            context.node.body.splice(context.position + fallthroughPosition++, 0, statement);
                            return true;
                        }, this);
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
    exports.SwitchStatement = SwitchStatement;
}());

//# sourceMappingURL=lib/ast/statements/SwitchStatement.map