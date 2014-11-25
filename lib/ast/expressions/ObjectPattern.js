"use strict";
(function () {
    var Node = require("../Node").Node;
    function ObjectPattern(properties) {
        Node.call(this);
        this.type = "ObjectPattern";
        this.properties = properties;
        this.properties.every(function (property) {
            property.parent = this;
            return true;
        }, this);
    }
    ObjectPattern.prototype = Object.create(Node);
    ObjectPattern.prototype.codegen = function () {
        if (!Node.prototype.codegen.call(this)) {
            return;
        }
        this.properties.every(function (property, i) {
            this.properties[i] = property.codegen();
            return true;
        }, this);
        return this;
    };
    ObjectPattern.prototype.hasCallExpression = function () {
        return true;
    };
    exports.ObjectPattern = ObjectPattern;
}());

//# sourceMappingURL=lib/ast/expressions/ObjectPattern.map