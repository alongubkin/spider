"use strict";
(function () {
    var Node = require("../Node").Node;
    function ImportDeclarationStatement(specifiers, source, kind) {
        Node.call(this);
        this.type = "ImportDeclaration";
        this.kind = kind;
        this.specifiers = specifiers;
        this.specifiers.every(function (specifier) {
            specifier.parent = this;
            return true;
        }, this);
        this.source = source;
        this.source.parent = this;
    }
    ImportDeclarationStatement.prototype = Object.create(Node);
    ImportDeclarationStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.specifiers.every(function (specifier, i) {
            this.specifiers[i] = specifier.codegen();
            return true;
        }, this);
        this.source = this.source.codegen();
        return this;
    };
    exports.ImportDeclarationStatement = ImportDeclarationStatement;
}());

//# sourceMappingURL=lib/ast/statements/ImportDeclarationStatement.map