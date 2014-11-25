"use strict";
(function () {
    var Node = require("../Node").Node;
    function UseStatement(identifiers) {
        Node.call(this);
        this.type = "UseStatement";
        this.identifiers = identifiers;
        this.identifiers.every(function (id) {
            id.parent = this;
            return true;
        }, this);
    }
    UseStatement.prototype = Object.create(Node);
    UseStatement.predefinedCollections = {
        "browser": [
            "document",
            "window",
            "screen",
            "location",
            "navigator",
            "alert",
            "console",
            "setTimeout"
        ],
        "node": [
            "require",
            "exports",
            "module",
            "global",
            "console",
            "process",
            "setTimeout",
            "__dirname",
            "__filename"
        ]
    };
    UseStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        var context = this.getContext().node;
        this.identifiers.every(function (id) {
            if (id.predefinedCollection) {
                exports.UseStatement.predefinedCollections[id.name].every(function (p) {
                    context.defineIdentifier({ name: p });
                    return true;
                }, this);
            } else {
                context.defineIdentifier(id);
            }
            return true;
        }, this);
        return null;
    };
    exports.UseStatement = UseStatement;
}());

//# sourceMappingURL=lib/ast/statements/UseStatement.map