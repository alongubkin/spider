"use strict";
(function () {
    var Node = require("../Node").Node;
    function BooleanLiteral(text) {
        Node.call(this);
        this.type = "Literal";
        this.value = text === "true";
        this.raw = text;
    }
    BooleanLiteral.prototype = Object.create(Node);
    BooleanLiteral.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        return this;
    };
    BooleanLiteral.prototype.hasCallExpression = function () {
        return false;
    };
    exports.BooleanLiteral = BooleanLiteral;
}());

//# sourceMappingURL=lib/ast/literals/BooleanLiteral.map