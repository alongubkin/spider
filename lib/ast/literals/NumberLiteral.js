"use strict";
(function () {
    var Node = require("../Node").Node;
    function NumberLiteral(text) {
        Node.call(this);
        this.type = "Literal";
        this.value = Number(text);
        this.raw = text;
    }
    NumberLiteral.prototype = Object.create(Node);
    NumberLiteral.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        return this;
    };
    NumberLiteral.prototype.hasCallExpression = function () {
        return false;
    };
    exports.NumberLiteral = NumberLiteral;
}());

//# sourceMappingURL=lib/ast/literals/NumberLiteral.map