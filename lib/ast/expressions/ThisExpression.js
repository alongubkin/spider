"use strict";
(function () {
    var Node = require("../Node").Node;
    function ThisExpression() {
        Node.call(this);
        this.type = "ThisExpression";
    }
    ThisExpression.prototype = Object.create(Node);
    ThisExpression.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        var parent = this.parent;
        while (!!(typeof parent !== "undefined" && parent !== null) && !!(!!(parent.type !== "FunctionExpression") || !parent.__fatArrow)) {
            parent = parent.parent;
        }
        if (typeof parent !== "undefined" && parent !== null) {
            this.type = "Identifier";
            Object.defineProperty(this, "name", {
                value: "_this",
                enumerable: true
            });
        }
        return this;
    };
    ThisExpression.prototype.hasCallExpression = function () {
        return false;
    };
    exports.ThisExpression = ThisExpression;
}());

//# sourceMappingURL=lib/ast/expressions/ThisExpression.map