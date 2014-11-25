"use strict";
(function () {
    var Node = require("../Node").Node;
    function ArrayPattern(elements) {
        Node.call(this);
        this.type = "ArrayPattern";
        this.elements = elements;
        this.elements.every(function (element) {
            if (typeof element !== "undefined" && element !== null) {
                element.parent = this;
            }
            return true;
        }, this);
    }
    ArrayPattern.prototype = Object.create(Node);
    ArrayPattern.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.elements.every(function (element, i) {
            this.elements[i] = typeof element !== "undefined" && element !== null ? element.codegen(false) : void 0;
            return true;
        }, this);
        return this;
    };
    ArrayPattern.prototype.hasCallExpression = function () {
        return true;
    };
    exports.ArrayPattern = ArrayPattern;
}());

//# sourceMappingURL=lib/ast/expressions/ArrayPattern.map