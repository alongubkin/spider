"use strict";
(function () {
    var Node = require("../Node").Node;
    function WhileStatement(test, body) {
        Node.call(this);
        this.type = "WhileStatement";
        this.test = test;
        this.test.parent = this;
        this.body = body;
        this.body.parent = this;
    }
    WhileStatement.prototype = Object.create(Node);
    WhileStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.test = this.test.codegen();
        this.body = this.body.blockWrap().codegen();
        return this;
    };
    exports.WhileStatement = WhileStatement;
}());

//# sourceMappingURL=lib/ast/statements/WhileStatement.map