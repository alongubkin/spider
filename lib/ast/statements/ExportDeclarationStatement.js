"use strict";
(function () {
    var Node = require("../Node").Node;
    function ExportDeclarationStatement(specifiers, source, declaration, isDefault) {
        Node.call(this);
        this.type = "ExportDeclaration";
        this["default"] = isDefault;
        this.specifiers = specifiers;
        if (typeof specifiers !== "undefined" && specifiers !== null) {
            this.specifiers.every(function (specifier) {
                specifier.parent = this;
                return true;
            }, this);
        }
        this.source = source;
        if (typeof source !== "undefined" && source !== null) {
            this.source.parent = this;
        }
        this.declaration = declaration;
        if (typeof declaration !== "undefined" && declaration !== null) {
            this.declaration.parent = this;
        }
    }
    ExportDeclarationStatement.prototype = Object.create(Node);
    ExportDeclarationStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        if (typeof this.specifiers !== "undefined" && this.specifiers !== null) {
            this.specifiers.every(function (specifier, i) {
                this.specifiers[i] = specifier.codegen();
                return true;
            }, this);
        }
        this.source = typeof this.source !== "undefined" && this.source !== null ? this.source.codegen() : void 0;
        this.declaration = typeof this.declaration !== "undefined" && this.declaration !== null ? this.declaration.codegen() : void 0;
        return this;
    };
    exports.ExportDeclarationStatement = ExportDeclarationStatement;
}());

//# sourceMappingURL=lib/ast/statements/ExportDeclarationStatement.map