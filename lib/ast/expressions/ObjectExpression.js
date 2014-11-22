"use strict";
(function () {
    var Node = require("../Node").Node;
    function ObjectExpression(properties) {
        Node.call(this);
        this.type = "ObjectExpression";
        this.properties = properties;
        this.properties.every(function (property) {
            property.parent = this;
            return true;
        }, this);
    }
    ObjectExpression.prototype = Object.create(Node);
    ObjectExpression.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.properties.every(function (property, i) {
            this.properties[i] = property.codegen();
            return true;
        }, this);
        return this;
    };
    ObjectExpression.prototype.hasCallExpression = function () {
        return true;
    };
    exports.ObjectExpression = ObjectExpression;
}());

//# sourceMappingURL=lib/ast/expressions/ObjectExpression.map