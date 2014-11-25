"use strict";
(function () {
    var Node = require("./Node").Node;
    function ExportBatchSpecifier() {
        Node.call(this);
        this.type = "ExportBatchSpecifier";
    }
    ExportBatchSpecifier.prototype = Object.create(Node);
    ExportBatchSpecifier.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        return this;
    };
    exports.ExportBatchSpecifier = ExportBatchSpecifier;
}());

//# sourceMappingURL=lib/ast/ExportBatchSpecifier.map