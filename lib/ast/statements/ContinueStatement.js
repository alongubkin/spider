"use strict";
(function () {
    var Node = require("../Node").Node;
    function ContinueStatement() {
        Node.call(this);
        this.type = "ContinueStatement";
    }
    ContinueStatement.prototype = Object.create(Node);
    ContinueStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        return this;
    };
    exports.ContinueStatement = ContinueStatement;
}());

//# sourceMappingURL=lib/ast/statements/ContinueStatement.map