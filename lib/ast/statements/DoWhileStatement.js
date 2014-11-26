"use strict";
(function () {
    var Node = require("../Node").Node;
    function DoWhileStatement(test, body) {
        Node.call(this);
        this.type = "DoWhileStatement";
        this.test = test;
        this.test.parent = this;
        this.body = body;
        this.body.parent = this;
    }
    DoWhileStatement.prototype = Object.create(Node);
    DoWhileStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.test = this.test.codegen();
        this.body = this.body.blockWrap().codegen();
        return this;
    };
    exports.DoWhileStatement = DoWhileStatement;
}());

//# sourceMappingURL=lib/ast/statements/DoWhileStatement.map