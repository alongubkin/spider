"use strict";
(function () {
    var Node = require("../Node").Node;
    function SwitchStatement(discriminant, cases) {
        Node.call(this);
        this.type = "SwitchStatement";
        this.discriminant = discriminant;
        this.discriminant.parent = this;
        this.cases = cases;
        this.cases.forEach(function (caseClause) {
            caseClause.parent = this;
        }, this);
    }
    SwitchStatement.prototype = Object.create(Node);
    SwitchStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.discriminant = this.discriminant.codegen();
        var firstCase, currentCase, defaultCase;
        this.cases.forEach(function (caseClause) {
            if (!caseClause.tests) {
                defaultCase = caseClause;
                return;
            }
            if (!(typeof firstCase !== "undefined" && firstCase !== null)) {
                firstCase = caseClause.codegen();
                currentCase = firstCase;
            } else {
                currentCase.alternate = caseClause.codegen();
                currentCase = currentCase.alternate;
            }
        }, this);
        if (typeof defaultCase !== "undefined" && defaultCase !== null) {
            if (!(typeof firstCase !== "undefined" && firstCase !== null)) {
                Node.getErrorManager().error({
                    type: "SingleDefaultClause",
                    message: "default clause without other case clauses is disallowed.",
                    loc: defaultCase.loc
                });
            } else {
                currentCase.alternate = defaultCase.codegen();
            }
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