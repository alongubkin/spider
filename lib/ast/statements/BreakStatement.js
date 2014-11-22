"use strict";
(function () {
    var Node = require("../Node").Node;
    function BreakStatement() {
        Node.call(this);
        this.type = "BreakStatement";
    }
    BreakStatement.prototype = Object.create(Node);
    BreakStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        var parent = this.parent;
        while (!!(!!(typeof parent !== "undefined" && parent !== null) && !!(parent.type !== "ForInStatement")) && !!(parent.type !== "ForOfStatement")) {
            parent = parent.parent;
        }
        if (typeof parent !== "undefined" && parent !== null) {
            this.type = "ReturnStatement";
            this.argument = {
                "type": "Literal",
                "value": false
            };
        }
        return this;
    };
    exports.BreakStatement = BreakStatement;
}());

//# sourceMappingURL=lib/ast/statements/BreakStatement.map