"use strict";
(function () {
    var Node = require("../Node").Node;
    function BlockStatement(body) {
        Node.call(this);
        this.type = "BlockStatement";
        this.body = body;
        body.every(function (statement, i) {
            if (statement) {
                statement.parent = this;
            } else {
                body[i] = { type: "EmptyStatement" };
            }
            return true;
        }, this);
    }
    BlockStatement.prototype = Object.create(Node);
    BlockStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        var i = 0;
        while (i < this.body.length) {
            var statement = this.body[i];
            if (!statement || !!statement.codeGenerated) {
                i++;
                continue;
            }
            if (typeof statement.codegen === "function" ? statement.codegen() : void 0) {
                this.body[this.body.indexOf(statement)] = statement;
                i++;
            } else {
                this.body.splice(i, 1);
            }
        }
        return this;
    };
    exports.BlockStatement = BlockStatement;
}());

//# sourceMappingURL=lib/ast/statements/BlockStatement.map