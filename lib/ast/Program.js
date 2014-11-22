"use strict";
(function () {
    var Node = require("./Node").Node;
    function Program(body) {
        Node.call(this);
        this.type = "Program";
        this.body = body;
        body.every(function (statement, i) {
            if (typeof statement !== "undefined" && statement !== null) {
                statement.parent = this;
            } else {
                body[i] = { type: "EmptyStatement" };
            }
            return true;
        }, this);
    }
    Program.prototype = Object.create(Node);
    Program.prototype.codegen = function () {
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
            if (!!statement.codegen && !!statement.codegen()) {
                this.body[this.body.indexOf(statement)] = statement;
                i++;
            } else {
                this.body.splice(i, 1);
            }
        }
        return this;
    };
    exports.Program = Program;
}());

//# sourceMappingURL=lib/ast/Program.map