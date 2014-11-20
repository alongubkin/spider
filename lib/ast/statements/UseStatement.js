"use strict";
(function () {
    var Node = require("../Node").Node;
    function UseStatement(identifiers) {
        Node.call(this);
        this.type = "UseStatement";
        this.identifiers = identifiers;
        this.identifiers.forEach(function (id) {
            id.parent = this;
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
            "setTimeout"
        ]
    };
    UseStatement.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        var context = this.getContext().node;
        this.identifiers.forEach(function (id) {
            if (id.predefinedCollection) {
                exports.UseStatement.predefinedCollections[id.name].forEach(function (p) {
                    context.defineIdentifier({ name: p });
                }, this);
            } else {
                context.defineIdentifier(id);
            }
        }, this);
        return null;
    };
    exports.UseStatement = UseStatement;
}());

//# sourceMappingURL=lib/ast/statements/UseStatement.map