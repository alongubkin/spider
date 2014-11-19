"use strict";
(function () {
    var Node = require("../Node").Node;
    function ArrayExpression(elements) {
        Node.call(this);
        this.type = "ArrayExpression";
        this.elements = elements;
        this.elements.forEach(function (element) {
            element.parent = this;
        }, this);
    }
    ArrayExpression.prototype = Object.create(Node);
    ArrayExpression.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.elements.forEach(function (element, i) {
            this.elements[i] = element.codegen();
        }, this);
        return this;
    };
    ArrayExpression.prototype.hasCallExpression = function () {
        return true;
    };
    exports.ArrayExpression = ArrayExpression;
}());

//# sourceMappingURL=lib/ast/expressions/ArrayExpression.map