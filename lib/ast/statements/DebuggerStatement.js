"use strict";
(function () {
    var Node = require("../Node").Node;
    function DebuggerStatement() {
        Node.call(this);
        this.type = "DebuggerStatement";
    }
    DebuggerStatement.prototype = Object.create(Node);
    DebuggerStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        return this;
    };
    exports.DebuggerStatement = DebuggerStatement;
}());

//# sourceMappingURL=lib/ast/statements/DebuggerStatement.map