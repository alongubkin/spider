"use strict";
(function () {
    var Node = require("../Node").Node;
    function ThrowStatement(argument) {
        Node.call(this);
        this.type = "ThrowStatement";
        this.argument = argument;
        this.argument.parent = this;
    }
    ThrowStatement.prototype = Object.create(Node);
    ThrowStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.argument = this.argument.codegen();
        return this;
    };
    exports.ThrowStatement = ThrowStatement;
}());

//# sourceMappingURL=lib/ast/statements/ThrowStatement.map