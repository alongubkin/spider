"use strict";
(function () {
    var Node = require("./Node").Node;
    function ImportNamespaceSpecifier(id) {
        Node.call(this);
        this.type = "ImportNamespaceSpecifier";
        this.id = id;
        this.id.parent = this;
    }
    ImportNamespaceSpecifier.prototype = Object.create(Node);
    ImportNamespaceSpecifier.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.id = this.id.codegen(false);
        this.getContext().node.defineIdentifier(this.id);
        return this;
    };
    exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
}());

//# sourceMappingURL=lib/ast/ImportNamespaceSpecifier.map