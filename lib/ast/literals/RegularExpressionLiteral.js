"use strict";
(function () {
    var Node = require("../Node").Node;
    function RegularExpressionLiteral(pattern, flags) {
        Node.call(this);
        this.type = "Literal";
        this.pattern = pattern;
        this.flags = flags;
    }
    RegularExpressionLiteral.prototype = Object.create(Node);
    RegularExpressionLiteral.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.value = new RegExp(this.pattern, this.flags);
        return this;
    };
    RegularExpressionLiteral.prototype.hasCallExpression = function () {
        return false;
    };
    exports.RegularExpressionLiteral = RegularExpressionLiteral;
}());

//# sourceMappingURL=lib/ast/literals/RegularExpressionLiteral.map