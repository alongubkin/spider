"use strict";
(function () {
    var Node = require("../Node").Node;
    function VariableDeclarationStatement(declarations) {
        Node.call(this);
        this.type = "VariableDeclaration";
        this.declarations = declarations;
        this.kind = "let";
        declarations.every(function (decl) {
            decl.parent = this;
            return true;
        }, this);
    }
    VariableDeclarationStatement.prototype = Object.create(Node);
    VariableDeclarationStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        var i = 0;
        while (i < this.declarations.length) {
            var statement = this.declarations[i].codegen();
            if (typeof statement !== "undefined" && statement !== null) {
                this.declarations[this.declarations.indexOf(statement)] = statement;
            }
            i++;
        }
        return this;
    };
    exports.VariableDeclarationStatement = VariableDeclarationStatement;
}());

//# sourceMappingURL=lib/ast/statements/VariableDeclarationStatement.map